import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const daySuffix = (number) => {
    if (number > 3 && number < 21){
        return "th";
    }
    switch (number % 10){
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
};

const todaysList = [];
const workList = [];
const d = new Date();
let date = days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate() + daySuffix(d.getDate());

app.get("/", (req, res) => {
    res.render("index.ejs", {
        date: date,
        toDoList: todaysList,
        active: "today"
     });
});

app.get("/work", (req, res) => {
    res.render("work.ejs", {
        date: date,
        toDoList: workList,
        active: "work"
     });
});

//Handle form post request, Add items to list
app.post("/submit", (req, res) => {
    if (req.body["list"] === "today"){
        todaysList.push(req.body["task"]);
        console.log("Todays List: " + todaysList);
        res.redirect("/");
    }
    else if (req.body["list"] === "work"){
        workList.push(req.body["task"]);
        console.log("Work List: " + workList);
        res.redirect("/work");
    }
    else {
        //Redirect back to main page
        res.redirect("/");
    }
});

//Handle delete requests
app.post("/delete", (req, res) =>{
    //Checks for delete button
    if(req.body.deleteWork){
        const deletedItem = req.body.deleteWork;
        workList.splice(deletedItem, 1);
        console.log("Work List: " + workList);
        res.redirect("/work");
    }
    else if (req.body.delete){
        const deletedItem = req.body.delete;
        todaysList.splice(deletedItem, 1);
        console.log("Todays List: " + todaysList);
        res.redirect("/");
    }
    else {
        //Redirect back to main page
        res.redirect("/");
    } 
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

