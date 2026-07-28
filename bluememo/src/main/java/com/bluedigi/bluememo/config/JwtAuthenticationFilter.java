package com.bluedigi.bluememo.config;

import java.io.IOException;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.bluedigi.bluememo.identity.application.service.CustomUserService;
import com.bluedigi.bluememo.identity.infrastructure.security.JwtService;
import com.bluedigi.bluememo.shared.exception.SecurityErrorHandler;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter  {

    private final JwtService jwtService;
    private final CustomUserService userService;
    private final SecurityErrorHandler securityErrorHandler;

    public JwtAuthenticationFilter(JwtService jwtService, CustomUserService userService, SecurityErrorHandler securityErrorHandler) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.securityErrorHandler = securityErrorHandler;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws IOException, ServletException {


        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader.substring(7);
        String email;

        try {
            email = jwtService.getSubject(token);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails user = userService.loadUserByUsername(email);

                if (!jwtService.isTokenValid(token, user)) {
                    securityErrorHandler.commence(
                        request, 
                        response, 
                        new BadCredentialsException("Invalid token")
                    );
                    return;
                }

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    user,
                    null,
                    user.getAuthorities()
                );

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception exception) {
            SecurityContextHolder.clearContext();
            securityErrorHandler.commence(
                request, 
                response, 
                new BadCredentialsException(
                    "Invalid or Expired token",
                    exception
                )
            );
            return;
        }

        filterChain.doFilter(request, response);
    }
}
