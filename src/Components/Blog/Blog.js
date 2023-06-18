import React from 'react';

const Blog = () => {
    const cardData= [
        {
            "Question": "What are the different ways to manage a state in a React application?",
            "Answer": "useState, useReducer, useRef, useEffect etc"
        },
        {
            "Question": "How does prototypical inheritance work?",
            "Answer": "Prototype inheritance in javascript is the linking of prototypes of a parent object to a child object to share and utilize the properties of a parent class using a child class.Prototypes are hidden objects that are used to share the properties and methods of a parent class to child classes."
        },
        {
            "Question": "What is a unit test? Why should we write unit tests?",
            "Answer":"The main objective of unit testing is to isolate written code to test and determine if it works as intended. Unit testing is an important step in the development process. If done correctly, unit tests can detect early flaws in code which may be more difficult to find in later testing stages."
        },
        {
            "Question": "React vs. Angular vs. Vue?",
            "Answer": "A simple difference between these three is that React is a UI library, and Vue is a progressive framework. However, Angular is a full-fledged front-end framework."
        }
    ]
    return (
        <div className='container-fluid'>
            <div className="row g-2">
                {
                    cardData.map((item, index)=><div className="col-12 col-md-12 col-lg-12" key={index}>
                    <div className="card">
                        <h5 className='fw-bold text-white p-2 bg-success' >{item.Question}</h5>
                        <p className='text-align-center p-2'>{item.Answer}</p>
                    </div>
                </div>)
                }
                
            </div>
        </div>
    );
};

export default Blog;