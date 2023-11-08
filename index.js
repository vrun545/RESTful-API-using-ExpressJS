const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {id:1, name:"Java"},
    {id:2, name:"Ruby"},
    {id:3, name:"C++"},
    {id:4, name:"Python"},
]

// Get API
// Here 1st argument is route (path of website) and another is a callback function
// callback function also called route handler
app.get('/', (req, res) => {
    res.send("Hello World !!!");
});


app.get('/api/courses', (req, res) => {
    res.send(courses);
});


app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.params);   // output { "year": "2018", "month":"1"}
})


app.get('/api/courses/:id', (req, res) => {
    // Look up for the course
    const course = courses.find(c => c.id === parseInt(req.params.id)) // req.params.id returns a string so we are convert it into integer
    // if course not found - return 404 
    if (!course)  return res.status(404).send("The course with given ID was not found");

    res.send(course);
});


app.post('/api/courses', (req, res) => {
    // Validating the name property
    const { error } = validateCourse(req.body);
    if (error)  return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});


app.put('/api/courses/:id', (req, res) => {
    // Look up the course
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course)  return res.status(404).send("The course with given ID was not found");

    // Validate
    // If invalid, return 400 - Bad Request
    const { error } = validateCourse(req.body);
    if (error)  return res.status(400).send(error.details[0].message);

    // Update Course
    course.name = req.body.name;
    // Return the course 
    res.send(course);
});


app.delete('/api/courses/:id', (req, res) => {
    // Look up for course
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course)  return res.status(404).send("The course with given ID was not found");

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Return the same course
    res.send(course);
});


// for Validating name property
function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}



// We should not provide hard code port number on production enviornement. It should be provided by hosting envirnment where you have deployed this application.
// So following is the way to handle port number 
// Use command SET PORT = 5000 on terminal to set Port number to Node Application
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on post ${port}...`));