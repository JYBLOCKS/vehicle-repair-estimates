import {
  AppBar,
  Button,
  Stack,
  Toolbar,
  Typography,
  useColorScheme,
} from "@mui/material";
import { useNavigate } from "react-router";
import ThemeToggle from "../../../themes/ThemeToggle";
import { useAuth } from "../../../features/auth/context/Auth";

const NavBar = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { mode } = useColorScheme();
  const theme = mode === "dark";

  const handleGoToLoginClick = () => {
    navigate("/login");
  };

  const handleLogoClick = () => {
    auth.Logout();
    navigate("/login");
  };

  return (
    <AppBar
      variant="outlined"
      color="default"
      sx={{ top: 0, zIndex: 1000, height: 66 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography color={theme ? "primary" : "secondary"} fontWeight={"bold"}>
          Vehicle Repair Estimates
        </Typography>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          {auth.user ? (
            <>
              <Typography
                color={theme ? "primary" : "secondary"}
                fontWeight={"bold"}
              >
                {auth.user.email}
              </Typography>
              <Button variant="text" onClick={handleLogoClick}>
                <Typography
                  color={theme ? "primary" : "secondary"}
                  fontWeight={"bold"}
                >
                  Logout
                </Typography>
              </Button>
            </>
          ) : (
            <Button variant="text" onClick={handleGoToLoginClick}>
              <Typography
                color={theme ? "primary" : "secondary"}
                fontWeight={"bold"}
              >
                Login
              </Typography>
            </Button>
          )}
          <ThemeToggle />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
export default NavBar;
