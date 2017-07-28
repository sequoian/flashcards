INSERT INTO users (name, email, password, is_staff)
  VALUES ('zach', 'placeholderemail', 'placeholderpassword', 'true');

INSERT INTO decks (title, author, is_public) VALUES 
  ('Regular Expressions', 1, 'false'),
  ('Vim Commands', 1, 'false');

INSERT INTO cards (deck_id, placement, front, back) VALUES 
  (1, 1, '\w', 'word character'),
  (1, 2, '\d', 'digit'),
  (1, 3, '[ ]', 'character set: match any character in the set'),
  (1, 4, '\s', 'whitespace'),
  (1, 5, '.', 'match any character except line breaks'),
  (1, 6, '^', 'matches the beginning of the string'),
  (1, 7, '$', 'matches the end of the string'),
  (2, 1, 'w', 'move cursor forward by one word'),
  (2, 2, 'b', 'move cursor backward by one word'),
  (2, 3, 'A', 'append text to the end of the current line'),
  (2, 4, ':q', 'quit'),
  (2, 5, 'o (lowercase)', 'open new line after current line'),
  (2, 6, 'O (uppercase)', 'open new line before current line'),
  (2, 7, '$', 'move cursor to the end of the current line'),
  (2, 8, '0', 'move cursor to the beginning of the current line'),
  (2, 9, ':wq', 'save and quit'),
  (2, 10, 'i', 'insert text before current cursor position');