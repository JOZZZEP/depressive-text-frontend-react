import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";

export const Loading = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        display: "flex",
        flexDirection:"column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress color="success" size={80} />
      <Typography mt={2} color={"primary.dark"} fontWeight={"regular"} variant="h6">
        Please wait...
      </Typography>
    </Box>
  );
};
