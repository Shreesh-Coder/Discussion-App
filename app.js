let questions = []
const questionsArea = document.getElementById("questions-list");
const questionSubjet = document.getElementById("question-subject");
const questionText = document.getElementById("question-area");
const submit = document.getElementById("submit");
const instructionArea = document.getElementById("instructions");
const inputArea = document.getElementById("input-area");
const rightPanel = document.getElementById("right-panel");
const newQuestionFormButton = document.getElementById("question-form");
const searchQuestionEle = document.getElementById("search-question");
const nullID = {ele: null};

let showQuestions = []
let questionOnLeft = []
let isOnLoad = false;

class Question{
    constructor(subject, text, responses = [], upVote = 0, downVote = 0, isChecked = false)
    {
        this.subject = subject;
        this.text = text;
        this.responses = responses;
        this.upVote = upVote;
        this.downVote = downVote;
        this.createdTime = new Date();
        this.isChecked = isChecked;
    }    
}

class Response{
    constructor(name, text)
    {
        this.name = name;
        this.text = text;
        this.createdTime = new Date();
    }
}


submit.onclick = () =>{

    isOnLoad = false;

    if(questionSubjet.value === "" || questionText.value === "")
    {
        return;
    }

    let question = new Question(questionSubjet.value, questionText.value);    
    
    questions.push(question);

    showQuestion(question);

    questionSubjet.value = "";
    questionText.value = "";
};

function showQuestion(question)
{
    let questionContainer = document.createElement("div");
    let questionEle = document.createElement("h2");
    let questionTextEle = document.createElement("p");
    const questionUpVoteEle = document.createElement("p");
    const questionDownVoteEle = document.createElement("p");
    const showTimeEle = document.createElement("p");
    const addFavoriteEle = document.createElement("input");

    addFavoriteEle.type = "checkbox";
    questionEle.innerHTML = question.subject;
    questionTextEle.innerHTML = question.text;

    let obj = {
        question: question,
        questionContainer: questionContainer,
        addFavoriteEle: addFavoriteEle
    };

    questionContainer.onclick = responseMode.bind(obj);

    if(isOnLoad)
    {
        addFavoriteEle.checked = question.isChecked;
    }

    addFavoriteEle.onclick = () =>{
        addFavoriteQuestion();
        question.isChecked = addFavoriteEle.checked;
    };

    addFavoriteEle.classList.add("star")

    questionOnLeft.push(obj);

    showTime(showTimeEle, question);

    styleQuestion(questionContainer);

    questionContainer.appendChild(questionEle);
    questionContainer.appendChild(questionTextEle);
    questionContainer.appendChild(questionUpVoteEle);
    questionContainer.appendChild(questionDownVoteEle);
    questionContainer.appendChild(showTimeEle);
    questionContainer.appendChild(addFavoriteEle);

    questionsArea.appendChild(questionContainer);
}


function responseMode()
{
    disableQuestionForm();    
    
    let showQuestion = findQuestionInShowQuestions(this.question);
    
    let isShowQuestion = showQuestionsWhereIsShownTrue(this.question);
    console.log(this);
    for(let i = 0; i < isShowQuestion.length; i++)
    {
        disableResponseForm(isShowQuestion[i]);
    }

    if(showQuestion != null)
        disableResponseForm(showQuestion);

    if(showQuestion == null)
        showResponseForm(this);
    
    if(showQuestion != null)
        enableResponseForm(showQuestion);
}

function showResponseForm(obj)
{
    let questionAreaEle = showQuestionArea(obj.question);
    let responseAreaEle = showResponseArea(obj.question);
    showQuestions.push({
        question: obj.question,
        questionContainer: obj.questionContainer,
        questionAreaEle: questionAreaEle,
        responseAreaEle: responseAreaEle,
        isShow: true,
        isCreated: true        
    });
}


function showQuestionArea(question)
{
    const questionAreaEle = document.createElement("div");
    const headingEle = document.createElement("h2");
    const questionDetaileEle = document.createElement("div");
    const questionHeadingEle = document.createElement("h3");
    const questionTextEle = document.createElement("p");
    const resolveButton = document.createElement("button");
    const upVoteButton = document.createElement("button");
    const downVoteButton = document.createElement("button");
    const showTimeEle = document.createElement("p");

    headingEle.innerHTML = "Question";
    console.log(question)
    questionHeadingEle.innerHTML = question.subject;
    questionTextEle.innerHTML = question.text;

    resolveButton.innerHTML = "Resolve";
    upVoteButton.innerHTML = "Up Vote";
    downVoteButton.innerHTML = "Down Vote";


    upVoteButton.onclick = upVoteChanges.bind(question);
    downVoteButton.onclick = downVoteChanges.bind(question);

    resolveButton.onclick = deleteQuestion.bind(question);

    showTime(showTimeEle, question);

    resolveButton.classList.add("button-style");
    upVoteButton.classList.add("button-style");
    downVoteButton.classList.add("button-style");
    headingEle.classList.add("question-heading");
    questionDetaileEle.classList.add("question-detaile");
    questionAreaEle.classList.add("question-area-right");

    questionDetaileEle.appendChild(questionHeadingEle);
    questionDetaileEle.appendChild(questionTextEle);
    questionDetaileEle.appendChild(showTimeEle);

    questionAreaEle.appendChild(headingEle);
    questionAreaEle.appendChild(questionDetaileEle);    
    questionAreaEle.appendChild(upVoteButton);
    questionAreaEle.appendChild(downVoteButton);
    questionAreaEle.appendChild(resolveButton);

    rightPanel.appendChild(questionAreaEle);

    return questionAreaEle;
}


function showResponseArea(question)
{
    const responseAreaEle = document.createElement("div");    
    const responseListHeadingEle = document.createElement("h2");
    const responseListEle = document.createElement("div");
    const headingEle = document.createElement("h2");
    const responseDetaileEle = document.createElement("div");
    const responseNameEle = document.createElement("input");
    const responseTextEle = document.createElement("textArea");
    const submitButton = document.createElement("button");

    headingEle.innerHTML = "Add Response";

    responseNameEle.placeholder = "Enter Name";
    responseTextEle.placeholder = "Enter Comment";

    responseListHeadingEle.innerHTML = "Response";
    responseListHeadingEle.style.display = "none";
    responseListEle.style.display = "none";

    submitButton.innerHTML = "Submit";


    let obj = {
        question: question,
        responseNameEle: responseNameEle,
        responseTextEle: responseTextEle, 
        responseListHeadingEle: responseListHeadingEle,
        responseListEle: responseListEle,
        responseTimeCreated: null
    };

    submitButton.onclick = addResponseToQuestion.bind(obj);

    styleResponseList(responseListEle);
    styleResponseDetaile(responseDetaileEle);
    responseAreaEle.classList.add("response-area");
    submitButton.classList.add("button-style");

    responseDetaileEle.appendChild(responseNameEle);
    responseDetaileEle.appendChild(responseTextEle);

    responseAreaEle.appendChild(responseListHeadingEle);
    responseAreaEle.appendChild(responseListEle);
    responseAreaEle.appendChild(headingEle);
    responseAreaEle.appendChild(responseDetaileEle);    
    responseAreaEle.appendChild(submitButton);

    rightPanel.appendChild(responseAreaEle);

    if(isOnLoad)
    {
        question.responses.forEach(ele =>{
            responseNameEle.value = ele.name;
            responseTextEle.value = ele.text;
            obj.responseTimeCreated = new Date(ele.createdTime);
            console.log(obj.responseTimeCreated);
            submitButton.onclick();
        });
        
        obj.responseTimeCreated = null;
    }

    return responseAreaEle;
}

function disableQuestionForm()
{
    instructionArea.style.display = "none";
    inputArea.style.display = "none";
}

function disableResponseForm(showQuestion)
{
    showQuestion.questionAreaEle.style.display = "none";
    showQuestion.responseAreaEle.style.display = "none";
    showQuestion.isShow = false;
}

function enableQuestionForm()
{
    instructionArea.style.display = "flex";
    inputArea.style.display = "flex";
}

function enableResponseForm(showQuestion)
{
    showQuestion.questionAreaEle.style.display = "block";
    showQuestion.responseAreaEle.style.display = "block";
    showQuestion.isShow = true;
}

newQuestionFormButton.onclick = () =>{
    let showQuestions = showQuestionsWhereIsShownTrue(null);
    for(let i = 0; i < showQuestion.length; i++)
        disableResponseForm(showQuestions[i]);
    enableQuestionForm();
}

function addResponseToQuestion()
{    
    if(!isOnLoad && (this.responseNameEle.value === "" || this.responseTextEle.value === ""))
    {
        return;    
    }

    console.log(this);

    let response = new Response(this.responseNameEle.value, this.responseTextEle.value);
   
    console.log(this.responseTimeCreated);

    if(this.responseTimeCreated !== null)
        response.createdTime = this.responseTimeCreated;

    console.log(this.responseNameEle.value);

    let flag = true;
    this.question.responses.forEach(ele =>{
        if(ele.text == response.text)
        {
            flag = false;
        }
    });

    if(flag)
    {
        this.question.responses.push(response);
    }

    this.responseListHeadingEle.style.display = "block";
    this.responseListEle.style.display = "block";

    showResponse(response, this.responseListEle);    


    this.responseNameEle.value = ""; 
    this.responseTextEle.value = "";
}

function showResponse(response, responseListEle)
{
    const responseContainer = document.createElement("div");
    let nameEle = document.createElement("h2");
    let responseTextEle = document.createElement("p");
    const showTimeEle = document.createElement("p");

    nameEle.innerHTML = response.name;
    responseTextEle.innerHTML = response.text;

    styleResponse(responseContainer);
    
    showTime(showTimeEle, response);

    responseContainer.appendChild(nameEle);
    responseContainer.appendChild(responseTextEle);
    responseContainer.appendChild(showTimeEle);

    responseListEle.appendChild(responseContainer);
}

function findQuestionInShowQuestions(question)
{
    for(let i = 0; i < showQuestions.length; i++)
    {
        if(question === showQuestions[i].question)
        {
            return showQuestions[i];
        }
    }

    return null;
}

function showQuestionsWhereIsShownTrue(question)
{
    return showQuestions.filter(ele => ele.isShow && question !== ele.quesiton);
}

const errorReportEle = document.createElement("h2");
errorReportEle.innerHTML = "Question Not Found";
questionsArea.appendChild(errorReportEle);
errorReportEle.style.display = "none";

searchQuestionEle.addEventListener("keyup", (event) =>{
    
    
    event.preventDefault();
    let searchText = searchQuestionEle.value;
    
    

    for(let i = 0; i < questionOnLeft.length; i++)
    {
        if(questionOnLeft[i] != nullID)
        {
            if(questionOnLeft[i].questionContainer.style.display === "none")
                questionOnLeft[i].questionContainer.style.display = "block";
        }
    }
    

    let questionsNotMatching = questionOnLeft.filter(ele =>  {
        if(ele != nullID)
            return ele.question.subject.search(searchText) == -1
        }
    );        
    
    for(let i = 0; i < questionsNotMatching.length; i++)
    {
        if(questionsNotMatching[i] != nullID)
            questionsNotMatching[i].questionContainer.style.display = "none";
    }


    if(questionsNotMatching.length == questionOnLeft.length)
    {
        errorReportEle.style.display = "block";
    }
    else{
        errorReportEle.style.display = "none";
    }
    

});

function upVoteChanges()
{
    this.upVote++;
    let questionContainerEle;
    
    for(let i = 0; i < questionOnLeft.length; i++)
    {
        if(this === questionOnLeft[i].question)
            questionContainerEle = questionOnLeft[i].questionContainer;
    }
    
    sortQuestionOnLeftAccordingToUpVote();
        
    showUpVote(questionContainerEle, this.upVote);

    addFavoriteQuestion();

}

function showUpVote(questionContainerEle, upVote)
{
    questionContainerEle.childNodes[2].innerHTML = `UpVote = ${upVote}`;
}

function downVoteChanges()
{
    this.downVote--;

    let questionContainerEle

    for(let i = 0; i < questionOnLeft.length; i++)
    {
        if(this === questionOnLeft[i].question)
            questionContainerEle = questionOnLeft[i].questionContainer;
    }

    showDownVote(questionContainerEle, this.downVote);
}


function showDownVote(questionContainerEle, downVote)
{
    questionContainerEle.childNodes[3].innerHTML = `DownVote = ${downVote}`;
}

function deleteQuestion()
{
    showQuestions.forEach(ele =>{
        if(ele.question == this)
        {
            while(ele.questionContainer.hasChildNodes())
            {
                ele.questionContainer.removeChild(ele.questionContainer.firstChild);
            }

            while(ele.questionAreaEle.hasChildNodes())
            {
                ele.questionAreaEle.removeChild(ele.questionAreaEle.firstChild);
            }

            while(ele.responseAreaEle.hasChildNodes())
            {
                ele.responseAreaEle.removeChild(ele.responseAreaEle.firstChild);
            }

            ele.questionContainer.remove();
            ele.questionAreaEle.remove();
            ele.responseAreaEle.remove();
        }
    });



    removeQuestionFromLists(this);

    enableQuestionForm();
}



function removeQuestionFromLists(question)
{
    showQuestions.forEach((ele, index, arr) =>{
        if(ele.question == question)
            arr[index] = nullID;
    });

    questionOnLeft.forEach((ele, index, arr) =>{
        if(ele.question == question)
            arr[index] = nullID;
    });

    questions.forEach((ele, index, arr) =>{
        if(ele == question)
            arr[index] = nullID;
    });
}

window.addEventListener("unload", () =>{
    let temp = [];

    questions.forEach(ele =>{
        if(ele != nullID)
            temp.push(ele);
    });
   
    window.localStorage.setItem("questions", JSON.stringify(temp));
});

window.addEventListener("load", () =>{

    isOnLoad = true;
    questions = JSON.parse(window.localStorage.getItem("questions"));    

    if(questions == undefined)
    {
        questions =  [];
    }

    questions.sort((a, b) =>{
        return b.upVote - a.upVote;
    });
    
    console.log(questions);

    for(let i = 0; i < questions.length; i++)
    {
        showQuestion(questions[i]);
        questionOnLeft[i].questionContainer.onclick(); 
        
        if(questions[i].upVote > 0)
        {
            showUpVote(questionOnLeft[i].questionContainer, questions[i].upVote);
        }

        if(questions[i].downVote < 0)
        {
            showDownVote(questionOnLeft[i].questionContainer, questions[i].downVote);
        }
    }

    newQuestionFormButton.onclick();

    addFavoriteQuestion();

    isOnLoad = false;
});


function styleQuestion(questionContainer)
{
    questionContainer.classList.add("question");
}

function styleResponse(responseContainer)
{
    responseContainer.classList.add("response");
}

function styleResponseList(responseListEle)
{
    responseListEle.classList.add("response-list");
}

function styleResponseDetaile(responseDetaileEle)
{
    responseDetaileEle.classList.add("response-input")
}

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

async function showTime(domEle, obj)
{
if(typeof(obj.createdTime) === "string")
{
    obj.createdTime = new Date(obj.createdTime);
}
setInterval(() =>{
    domEle.innerHTML = timeSince(obj.createdTime);
}, 1000);
}


function addFavoriteQuestion()
{
    sortQuestionOnLeftAccordingToUpVote();
    //Remove all the element form display
    questionOnLeft.forEach(ele =>{
        if(ele != nullID)
            ele.questionContainer.remove();
    });
    
    //Sort question according to checked value
    console.log(questionOnLeft);
    questionOnLeft.sort((a, b) =>{
        console.log(a.addFavoriteEle.checked);
        console.log(b.addFavoriteEle.checked);
        if((a.addFavoriteEle.checked && b.addFavoriteEle.checked) ||
         (!a.addFavoriteEle.checked && !b.addFavoriteEle.checked))
        {
            return 0;
        
        }
        

        if(a.addFavoriteEle.checked && !b.addFavoriteEle.checked)
        {
            return -1;
        }

        if(!a.addFavoriteEle.checked && b.addFavoriteEle.checked)
        {
            return 1;
        }        
    });
    console.log(questionOnLeft);
    //Append new Sorted questions on display
    questionOnLeft.forEach(ele =>{
        if(ele != nullID)
            questionsArea.appendChild(ele.questionContainer);
    });

}


function sortQuestionOnLeftAccordingToUpVote()
{
    //Remove all the element form display
    questionOnLeft.forEach(ele =>{
        if(ele != nullID)
            ele.questionContainer.remove();
    });
    
    //Sort the element according to upVote
    questionOnLeft.sort((a, b) => {
        if(a == nullID && b == nullID)
        {
            return 0;
        }
        if(a == nullID)
        {
            return b.question.upVote - Number.MIN_SAFE_INTEGER;
        }
        if(b == nullID)
        {
            return Number.MIN_SAFE_INTEGER - a.question.upVote;
        }

        if(a != nullID && b != nullID)
            return b.question.upVote - a.question.upVote;
    });
        
    //Append new Sorted questions on display
    questionOnLeft.forEach(ele =>{
        if(ele != nullID)
            questionsArea.appendChild(ele.questionContainer);
    });    
}