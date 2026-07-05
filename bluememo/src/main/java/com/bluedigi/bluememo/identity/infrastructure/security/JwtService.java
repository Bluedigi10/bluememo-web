package com.bluedigi.bluememo.identity.infrastructure.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.bluedigi.bluememo.identity.domain.model.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${bluememo.jwt.secret}")
    private String jwtSecret;

    @Value("${bluememo.jwt.expiration-ms}")
    private Long jwtExpirationMs;

    public String generateToken(User user) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("userId", user.getId().toString())
                .claim("name", user.getName())
                .issuedAt(now)
                .expiration(expiration)
                .signWith(getSigningKey())
                .compact();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}