 CREATE TABLE blogs (id SERIAL PRIMARY KEY, author TEXT, url TEXT NOT NULL, title TEXT NOT NULL, likes INTEGER DEFAULT
 0);


INSERT INTO blogs (author, url, title) VALUES ('Edem', 'https://github.com/KoblaQ', 'Github is Awesome');

INSERT INTO blogs (author, url, title) VALUES ('KoblaQ', 'https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-relational-databases', 'Amazing courses to consider');