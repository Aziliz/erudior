// Synthetic fixtures are test-only, never an authored/published course or production route.
import React from "react";
import {createRoot} from "react-dom/client";
import LearningGames from "../../src/pages/LearningGames";
import {emptyCourse} from "../../src/lib/course";
import "../../src/styles.css";
import "../../src/learningGames.css";
const course=emptyCourse("Synthetic browser activity");course.id="synthetic-browser";
course.decks=[{id:"test",title:"Browser test pairs",cards:Array.from({length:12},(_,i)=>({id:`pair-${i}`,front:`Prompt ${i}`,back:`Answer ${i}`,topic:"Browser practice"}))}];
const api={allCourses:[course]} as any;
createRoot(document.getElementById("root")!).render(<LearningGames api={api}/>);
