import {Grid, Box, Typography} from "@mui/material";
import MyDutiesTable from "../myTables/myDutiesTable/MyDutiesTable";
import MyConstraintsTable from "../myTables/myConstraintsTable/myConstraintsTable";

const HomePage = () => {
  return (
    <Grid container spacing={2} sx={{direction: "rtl"}}>
        <Grid item xs={6}>
            <Box sx={{backgroundColor: "#557A95", height: "100%", borderRadius: 2, marginRight: 2}}>
                <Typography sx={{direction: "rtl", margin: 2, color: "white"}} variant="h4">
                    שמירות שלי
                </Typography>
                <MyDutiesTable/>
            </Box>
        </Grid>
        <Grid item xs={6}>
            <Box sx={{backgroundColor: "#b1a296", height: "100%", borderRadius: 2, marginLeft: 2}}>
                <Typography sx={{direction: "rtl", margin: 2, color: "white"}} variant="h4">
                    אילוצים שלי
                </Typography>
                <MyConstraintsTable />
            </Box>
        </Grid>
        <Grid item xs={6}>
            <Box sx={{backgroundColor: "#918f92", height: "100%", borderRadius: 2, marginRight: 2}}>
                <Typography sx={{direction: "rtl", margin: 2, color: "white"}} variant="h4">
                    ברוכים הבאים למערכת האילוצים
                </Typography>
            </Box>
        </Grid>
        <Grid item xs={6}>
            <Box sx={{backgroundColor: "#7395ae", height: "100%", borderRadius: 2, marginLeft: 2}}>
                <Typography sx={{direction: "rtl", margin: 2, color: "white"}} variant="h4">
                    ברוכים הבאים למערכת האילוצים
                </Typography>
            </Box>
        </Grid>
    </Grid>
  );
};

export default HomePage;