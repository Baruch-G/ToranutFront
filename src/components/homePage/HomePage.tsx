import { Grid, Box, Typography } from "@mui/material";
import MyDutiesTable from "../myTables/myDutiesTable/MyDutiesTable";
import MyConstraintsTable from "../myTables/myConstraintsTable/myConstraintsTable";
import SwapsTable from "../swapsTable/SwapsTable";

interface HomePageProps {
  isAdmin: boolean;
}

const HomePage = (props: HomePageProps) => {
  return (
    <Grid container spacing={2} sx={{ direction: "rtl" }}>
      <Grid item xs={7} sx={{height: 468}}>
        <Box
          sx={{
            backgroundColor: "#557A95",
            height: "100%",
            borderRadius: 2,
            marginRight: 2,
          }}
        >
          <Typography
            sx={{ direction: "rtl", margin: 2, color: "white" }}
            variant="h4"
          >
            {props.isAdmin ? "טבלת שמירות" : "טבלת שמירות שלי"}
          </Typography>
          <MyDutiesTable />
        </Box>
      </Grid>
      <Grid item xs={5}>
        <Box
          sx={{
            backgroundColor: "#b1a296",
            height: "100%",
            borderRadius: 2,
            marginLeft: 2,
          }}
        >
          <Typography
            sx={{ direction: "rtl", margin: 2, color: "white" }}
            variant="h4"
          >
            {props.isAdmin ? "טבלת אילוצים" : "טבלת אילוצים שלי"}
          </Typography>
          <MyConstraintsTable />
        </Box>
      </Grid>

      <Grid item xs={props.isAdmin ? 7.6 : 7.8} sx={{height: 375}} >
        <SwapsTable isAdmin={props.isAdmin} />
      </Grid>
      <Grid item xs={props.isAdmin ? 4.4 : 4.2}>
        <Box
          sx={{
            backgroundColor: "#7395ae",
            height: "100%",
            borderRadius: 2,
            marginLeft: 2,
          }}
        >
          <Typography
            sx={{ direction: "rtl", margin: 2, color: "white" }}
            variant="h4"
          >
            ברוכים הבאים למערכת האילוצים
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default HomePage;
