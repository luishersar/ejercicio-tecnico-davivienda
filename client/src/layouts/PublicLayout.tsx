import { Grid, Paper } from '@mui/material'
import type { ReactNode } from 'react'
 
const PublicLayout = ({ children }: { children?: ReactNode }) => {
  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        backgroundColor: "#fafafa",
      }}
    >
      <Grid
        size={{ xs: 12, sm: 8, md: 4 }}
        sx={{
          margin: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            p: 4,
            borderRadius: 3,
          }}
        >
        {children}
        </Paper>
      </Grid>
    </Grid>
  )
}
 
export default PublicLayout