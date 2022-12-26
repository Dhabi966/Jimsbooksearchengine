import React from 'react';
import { useMutation } from '@apollo/client';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { GET_ME, REMOVE_BOOK } from '../utils/queries';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  // execute the GET_ME query and save the result to the userData variable
  const { data: userData, loading, error } = useQuery(GET_ME);

  // create the REMOVE_BOOK mutation
  const [removeBook] = useMutation(REMOVE_BOOK);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // execute the REMOVE_BOOK mutation
      const { data } = await removeBook({
        variables: { bookId },
      });

      // update the user data with the updated saved books list
      setUserData({ ...userData, savedBooks: data.removeBook });
      // upon success, remove book's id from local storage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if the query is still loading, display a loading message
  if (loading) return <h2>LOADING...</h2>;
  // if there was an error executing the query, display an error message
  if (error) return <h2>ERROR</h2>;

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;