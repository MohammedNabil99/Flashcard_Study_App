// "use client";

// import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Container,
//   Box,
//   Typography,
//   Paper,
//   TextField,
//   Button,
//   Grid,
//   Card,
//   CardActionArea,
//   CardContent,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   CircularProgress,
//   AppBar,
//   Toolbar,
// } from "@mui/material";
// import { doc, collection, getDoc, writeBatch } from "firebase/firestore";
// import { db } from "../../firebase";

// export default function Generate() {
//   const { isLoaded, isSignedIn, user } = useUser();
//   const [flashcards, setFlashcards] = useState([]);
//   const [flipped, setFlipped] = useState({});
//   const [text, setText] = useState("");
//   const [name, setName] = useState("");
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false); // State for loading
//   const router = useRouter();

//   useEffect(() => {
//     if (isLoaded && !isSignedIn) {
//       router.push("/sign-in"); // Redirect to sign-in page if not signed in
//     }
//   }, [isLoaded, isSignedIn, router]);

//   const handleSubmit = async () => {
//     if (!text.trim()) {
//       alert("Please enter some text to generate flashcards");
//       return;
//     }
//     setLoading(true); // Set loading to true when starting
//     try {
//       const response = await fetch("/api/generate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ text }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to generate flashcards");
//       }

//       const data = await response.json();
//       setFlashcards(data);
//       setFlipped({}); // Reset flipped state when new flashcards are generated
//     } catch (error) {
//       console.error("Error generating flashcards:", error);
//       alert("An error occurred while generating flashcards. Please try again");
//     } finally {
//       setLoading(false); // Set loading to false when done
//     }
//   };

//   const handleCardClick = (index) => {
//     setFlipped((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const handleOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const saveFlashcards = async () => {
//     if (!name) {
//       alert("Please enter a name");
//       return;
//     }

//     if (!user || !user.id) {
//       alert("User not signed in");
//       return;
//     }

//     const batch = writeBatch(db);
//     const userDocRef = doc(collection(db, "users "), user.id);
//     const docSnap = await getDoc(userDocRef);

//     if (docSnap.exists()) {
//       const collections = docSnap.data().flashcards || [];
//       if (collections.find((f) => f.name === name)) {
//         alert("Flashcard collection with the same name already exists");
//         return;
//       } else {
//         collections.push(name);
//         batch.set(userDocRef, { flashcards: collections }, { merge: true });
//       }
//     } else {
//       batch.set(userDocRef, { flashcards: [{ name }] });
//     }

//     const columnRef = collection(userDocRef, name);
//     flashcards.forEach((flashcard) => {
//       const cardDocRef = doc(columnRef);
//       batch.set(cardDocRef, flashcard);
//     });

//     await batch.commit();
//     handleClose();
//     router.push("/flashcards");
//   };

//   if (!isLoaded || !isSignedIn) {
//     return null; // Render nothing or a loading spinner while checking auth status
//   }

//   return (
//     <>
//       <AppBar position="static" style={{ width: "100vw" }}>
//         <Toolbar>
//           <Typography variant="h6" style={{ flexGrow: 1 }}>
//             Cognitive Cards
//           </Typography>
//           <SignedOut>
//             <Button color="inherit" href="/sign-in">
//               Login
//             </Button>
//             <Button color="inherit" href="/sign-up">
//               Sign Up
//             </Button>
//           </SignedOut>
//           <SignedIn>
//             <UserButton />
//           </SignedIn>
//           <Button color="inherit" href="/">
//             Home
//           </Button>
//           <SignedIn>
//             <Button color="inherit" onClick={() => router.push("/generate")}>
//               Generate
//             </Button>
//           </SignedIn>
//           <SignedIn>
//             <Button color="inherit" href="/flashcards">
//               Sets
//             </Button>
//           </SignedIn>
//         </Toolbar>
//       </AppBar>

//       <Container maxWidth="md">
//         <Box
//           sx={{
//             mt: 4,
//             mb: 6,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="h4" mb={2}>
//             Generate Flashcards
//           </Typography>
//           <Paper sx={{ p: 4, width: "100%" }}>
//             <TextField
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               label="Enter text"
//               fullWidth
//               multiline
//               rows={4}
//               variant="outlined"
//               sx={{ mb: 2 }}
//             />
//             <Button
//               variant="contained"
//               color="primary"
//               fullWidth
//               onClick={handleSubmit}
//               disabled={loading} // Disable button while loading
//             >
//               Submit
//             </Button>
//           </Paper>
//         </Box>
//         <Box sx={{ mt: 4 }}>
//           {loading ? (
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 height: "200px",
//               }}
//             >
//               <CircularProgress />
//             </Box>
//           ) : flashcards.length > 0 ? (
//             <>
//               <Typography variant="h5">Flashcards Preview</Typography>

//               {flashcards.map((flashcard, index) => (
//                 <Grid item xs={12} sm={6} md={4} key={index} sx={{ mt: 3 }}>
//                   <Card>
//                     <CardActionArea onClick={() => handleCardClick(index)}>
//                       <CardContent
//                         sx={{
//                           perspective: "1000px",
//                           "& > div": {
//                             transition: "transform 0.6s",
//                             transformStyle: "preserve-3d",
//                             position: "relative",
//                             width: "100%",
//                             height: "200px",
//                             transform: flipped[index]
//                               ? "rotateY(180deg)"
//                               : "rotateY(0deg)",
//                           },
//                           "& > div > div": {
//                             position: "absolute",
//                             width: "100%",
//                             height: "100%",
//                             backfaceVisibility: "hidden",
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                             padding: 2,
//                             boxSizing: "border-box",
//                             overflow: "hidden",
//                           },
//                           "& > div > div:nth-of-type(2)": {
//                             transform: "rotateY(180deg)",
//                             color: "green",
//                           },
//                         }}
//                       >
//                         <div>
//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "center",
//                               alignItems: "center",
//                               height: "100%",
//                               textAlign: "center",
//                               padding: 2,
//                             }}
//                           >
//                             <Typography
//                               variant="h6"
//                               component="div"
//                               sx={{
//                                 fontSize: "calc(10px + 1vw)",
//                                 wordBreak: "break-word",
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                               }}
//                             >
//                               {flashcard.front}
//                             </Typography>
//                           </div>
//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "center",
//                               alignItems: "center",
//                               height: "100%",
//                               textAlign: "center",
//                               padding: 2,
//                             }}
//                           >
//                             <Typography
//                               variant="h6"
//                               component="div"
//                               sx={{
//                                 fontSize: "calc(10px + 1vw)",
//                                 wordBreak: "break-word",
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                               }}
//                             >
//                               {flashcard.back}
//                             </Typography>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </CardActionArea>
//                   </Card>
//                 </Grid>
//               ))}
//               <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
//                 <Button
//                   variant="contained"
//                   color="success"
//                   onClick={handleOpen}
//                   sx={{ mb: 3 }}
//                 >
//                   Save
//                 </Button>
//               </Box>
//             </>
//           ) : null}
//         </Box>

//         <Dialog open={open} onClose={handleClose}>
//           <DialogTitle>Save Flashcards</DialogTitle>
//           <DialogContent>
//             Please enter a name for your flashcards collection
//           </DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Collection Name"
//             type="text"
//             fullWidth
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             variant="outlined"
//           />
//           <DialogActions>
//             <Button onClick={handleClose}>Cancel</Button>
//             <Button onClick={saveFlashcards}>Save</Button>
//           </DialogActions>
//         </Dialog>
//       </Container>
//     </>
//   );
// }

"use client";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  AppBar,
  Toolbar,
} from "@mui/material";
import { doc, collection, getDoc, writeBatch } from "firebase/firestore";
import { db } from "../../firebase";

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in"); // Redirect to sign-in page if not signed in
    }
  }, [isLoaded, isSignedIn, router]);

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards");
      return;
    }
    setLoading(true); // Set loading to true when starting
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await response.json();
      setFlashcards(data);
      setFlipped({}); // Reset flipped state when new flashcards are generated
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred while generating flashcards. Please try again");
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  const handleCardClick = (index) => {
    setFlipped((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!name) {
      alert("Please enter a name");
      return;
    }

    if (!user || !user.id) {
      alert("User not signed in");
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert("Flashcard collection with the same name already exists ");
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    handleClose();
    router.push("/flashcards");
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
            <Button color="inherit" onClick={() => router.push("/generate")}>
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

      <Container maxWidth="md">
        <Box
          sx={{
            mt: 4,
            mb: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" mb={2}>
            Generate Flashcards
          </Typography>
          <Paper sx={{ p: 4, width: "100%" }}>
            <TextField
              value={text}
              onChange={(e) => setText(e.target.value)}
              label="Enter text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              disabled={loading} // Disable button while loading
            >
              Submit
            </Button>
          </Paper>
        </Box>
        <Box sx={{ mt: 4 }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : flashcards.length > 0 ? (
            <>
              <Typography variant="h5">Flashcards Preview</Typography>

              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index} sx={{ mt: 3 }}>
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
              <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleOpen}
                  sx={{ mb: 3 }}
                >
                  Save
                </Button>
              </Box>
            </>
          ) : null}
        </Box>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Save Flashcards</DialogTitle>
          <DialogContent>
            Please enter a name for your flashcards collection
          </DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Collection Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
          />
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={saveFlashcards}>Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
