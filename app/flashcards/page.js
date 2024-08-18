"use client";

import { SignedOut, SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/navigation";
import {
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Button,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // Redirect to the sign-in page if the user is not signed in
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      const docRef = doc(collection(db, "users"), user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        setFlashcards(collections); // Update state with the fetched data
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
    }

    if (isSignedIn) {
      getFlashcards();
    }
  }, [user, isSignedIn]);

  if (!isLoaded || !isSignedIn) {
    return null; // Render nothing or a loading spinner while checking auth status
  }

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  return (
    <>
      <AppBar position="static" style={{ width: "100vw" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Cognitive Cards
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">
              Login
            </Button>
            <Button color="inherit" href="/sign-up">
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <Button color="inherit" href="/">
            Home
          </Button>
          <SignedIn>
            <Button color="inherit" href="/generate">
              Generate
            </Button>
          </SignedIn>
          <SignedIn>
            <Button color="inherit" href="/flashcards">
              Sets
            </Button>
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Container maxWidth="100vw">
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardActionArea
                  onClick={() => {
                    handleCardClick(flashcard.name); // Pass the correct id
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{flashcard.name}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
