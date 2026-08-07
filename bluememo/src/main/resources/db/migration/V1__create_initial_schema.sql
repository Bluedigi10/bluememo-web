CREATE TABLE users (
    id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    birthdate DATE,
    created_at TIMESTAMP(6),
    updated_at TIMESTAMP(6),

    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT uk_users_phone UNIQUE (phone)
);

CREATE TABLE todos (
    todo_id UUID NOT NULL,
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    status VARCHAR(255) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL,
    updated_at TIMESTAMP(6) NOT NULL,

    CONSTRAINT pk_todos PRIMARY KEY (todo_id),

    CONSTRAINT fk_todos_user
        FOREIGN KEY (user_id)
        REFERENCES users (id),

    CONSTRAINT uk_todos_user_title
        UNIQUE (user_id, title),

    CONSTRAINT ck_todos_status
        CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED'))
);