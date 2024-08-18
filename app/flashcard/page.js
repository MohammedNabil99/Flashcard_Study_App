"use client";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  AppBar,
  Toolbar,
} from "@mui/material";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // Redirect to the sign-in page if the user is not signed in
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;
      const docRef = collection(doc(collection(db, "users"), user.id), search);
      const docs = await getDocs(docRef);
      const flashcards = [];

      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(flashcards);
    }

    if (isSignedIn) {
      getFlashcard();
    }
  }, [user, search, isSignedIn]);

  const handleCardClick = (index) => {
    setFlipped((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (!isLoaded || !isSignedIn) {
    return null; // Render nothing or a loading spinner while checking auth status
  }

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
                <CardActionArea onClick={() => handleCardClick(index)}>
                  <CardContent
                    sx={{
                      perspective: "1000px",
                      "& > div": {
                        transition: "transform 0.6s",
                        transformStyle: "preserve-3d",
                        position: "relative",
                        width: "100%",
                        height: "200px",
                        transform: flipped[index]
                          ? "rotateY(180deg)"
                          : "rotateY(0deg)",
                      },
                      "& > div > div": {
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 2,
                        boxSizing: "border-box",
                        overflow: "hidden",
                      },
                      "& > div > div:nth-of-type(2)": {
                        transform: "rotateY(180deg)",
                        color: "green",
                      },
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          textAlign: "center",
                          padding: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{
                            fontSize: "calc(10px + 1vw)",
                            wordBreak: "break-word",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {flashcard.front}
                        </Typography>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          textAlign: "center",
                          padding: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{
                            fontSize: "calc(10px + 1vw)",
                            wordBreak: "break-word",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {flashcard.back}
                        </Typography>
                      </div>
                    </div>
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
