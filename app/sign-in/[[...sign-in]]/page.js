import { SignIn } from "@clerk/nextjs";
import {
  Link,
  AppBar,
  Button,
  Container,
  Toolbar,
  Typography,
  Box,
  IconButton,
} from "@mui/material";

export default function SignInPage() {
  return (
    <>
      <AppBar position="static" style={{ width: "100vw" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Cognitive Cards
          </Typography>
          <Button color="inherit" variant="">
            <Link href="/sign-in" color="inherit" passhref>
              Login
            </Link>
          </Button>

          <Button color="inherit">
            <Link href="/sign-up" color="inherit" passhref>
              Sign Up
            </Link>
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h4" gutterBottom sx={{ mt: 5 }}>
          <SignIn />
        </Typography>
      </Box>
    </>
  );
}
