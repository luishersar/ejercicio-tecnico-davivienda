import { useState } from "react";
import { Box, TextField, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchSurveyById() {
  const navigate = useNavigate();
  const [surveyId, setSurveyId] = useState("");

  const handleSubmit = () => {
    if (!surveyId.trim()) return;
    navigate(`/surveys/${surveyId}`);
  };

  return (
    <Box sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Si ya tienes el código de una encuesta, puedes responderla aquí:
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
      >
        <TextField
          label="Número de encuesta"
          variant="outlined"
          size="small"
          value={surveyId}
          onChange={(e) => setSurveyId(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          sx={{ maxWidth: 280 }}
        />

        <Button
          variant="contained"
          size="small"
          startIcon={<SearchIcon />}
          sx={{ px: 3, textTransform: "none" }}
          onClick={handleSubmit}
        >
          Buscar
        </Button>
      </Stack>
    </Box>
  );
}
