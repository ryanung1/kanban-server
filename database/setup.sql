DROP TABLE IF EXISTS subtasks;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS columns;
DROP TABLE IF EXISTS boards;
DROP TABLE IF EXISTS token;
DROP TABLE IF EXISTS user_account;

CREATE TABLE user_account (
    user_id INT GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(50) UNIQUE NOT NULL, 
    user_password CHAR(60) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id)
);

CREATE TABLE token (
    token_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL,
    token CHAR(36) NOT NULL,
    PRIMARY KEY (token_id),
    FOREIGN KEY (user_id) REFERENCES user_account("user_id")
);

CREATE TABLE boards (
    board_id INT GENERATED ALWAYS AS IDENTITY,
    board_name VARCHAR(30) NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (board_id),
    FOREIGN KEY (user_id) REFERENCES user_account("user_id")
);

CREATE TABLE columns (
    column_id INT GENERATED ALWAYS AS IDENTITY,
    column_name VARCHAR(200),
    board_id INT NOT NULL,
    PRIMARY KEY (column_id),
    CONSTRAINT fk_boards_columns_id
        FOREIGN KEY (board_id)
        REFERENCES boards("board_id")
        ON DELETE CASCADE
);

CREATE TABLE tasks (
    task_id INT GENERATED ALWAYS AS IDENTITY,
    task_name VARCHAR(30) NOT NULL,
    task_description VARCHAR(500) NOT NULL,
    column_id INT NOT NULL,
    completed BOOLEAN NOT NULL,
    PRIMARY KEY (task_id),
    CONSTRAINT fk_columns_tasks_id
        FOREIGN KEY (column_id)
        REFERENCES columns("column_id")
        ON DELETE CASCADE
);

CREATE TABLE subtasks (
    subtask_id INT GENERATED ALWAYS AS IDENTITY,
    subtask_name VARCHAR(30) NOT NULL,
    subtask_description VARCHAR(500) NOT NULL,
    task_id INT NOT NULL,
    completed BOOLEAN NOT NULL,
    PRIMARY KEY (subtask_id),
    CONSTRAINT fk_tasks_subtasks_id
        FOREIGN KEY (task_id)
        REFERENCES tasks("task_id")
        ON DELETE CASCADE
);

