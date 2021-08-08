let table = document.querySelector('tbody#catalog-body')
const seasons_dropdown = document.querySelector('ul#seasons-btn')
const main_body = document.querySelector('div#main-body')
const searchForm = document.querySelector('form#searchForm')

const OFFSET = 150


function createOneComment(commentObj) {
    const outerDiv = document.querySelector("div#comments-container")

    const newComment = document.createElement('div')

    newComment.classList.add('commented-section')
    newComment.classList.add('mt-2')

    newComment.innerHTML = `
    <hr>
    <div class="d-flex flex-row align-items-center commented-user">
        <h5 class="mr-2">[User]</h5><span class="dot mb-1"></span>
    </div>
    <div class="container d-flex ">
        <div class="row justify-content-md-center">
            
            <div class="col-md-8" style="font-size:1.15rem; word-wrap: break-word; width:67vw; max-width: 1224px; display: inline">
                <div class="m-0 " style="width: 40px; float: left;">
                    <i class="bi bi-caret-up-square" style="width: 40px"></i>
                    <i class="bi bi-caret-down-square" style="width: 40px"></i>
                </div>
                <div>
                    ${commentObj.content}
                </div>  

                
            </div>
            

        </div>
        
        
    </div>
    <span class="mb-1 ml-2">5 hours ago</span>
    <span class="mb-1 ml-2">Edit</span>
    <span class="mb-1 ml-2">Delete</span>
    

    `
    outerDiv.append(newComment)
    
}

function search() {
    console.log("searched")
    const searchBar = document.querySelector('input#searchBar')
    const filter = searchBar.value.toUpperCase()
    const rows = document.querySelectorAll("tbody#catalog-body tr.course")
    // const tableEles = document.querySelectorAll("tbody#catalog-body tr.course td")
    


    for (let i = 0; i < rows.length; i++) {
        const codeEle = rows[i].getElementsByTagName("td")[0]
        const titleEle = rows[i].getElementsByTagName("td")[1]
        const profEle = rows[i].getElementsByTagName("td")[2]

        const txtValueCode = codeEle.textContent || codeEle.innerText
        const txtValueTitle= titleEle.textContent || titleEle.innerText
        const txtValueProf = profEle.textContent || profEle.innerText

        // console.log(txtValue)
        if (txtValueCode.toUpperCase().indexOf(filter) > -1 || txtValueTitle.toUpperCase().indexOf(filter) > -1 || txtValueProf.toUpperCase().indexOf(filter) > -1) {
            rows[i].style.display = ""
        } else {
            rows[i].style.display = "none"
        }
    } 
}

function checkIfBlank(course, course_attr, tba=false) {
    if (course[course_attr] === "" || course[course_attr] === null) {
        if (tba) {
            return "TBA"
        }
        else {
            return "N/A"
        }
    }
    else {
        return course[course_attr]
    }
}

function refreshTable() {
    main_body.innerHTML = `
    <table class="table table-striped table-sticky table-hover">
    <thead>
      <tr>
        <th scope="col">Code</th>
        <th scope="col">Title</th>
        <th scope="col">Prof</th>
        <th scope="col">Gut Index</th>
        <th scope="col">Guttiness</th>
        <th scope="col">Gut Rank</th>
        <th scope="col">Gut Subject Rank</th>
        <th scope="col">Overall Rating</th>
        <th scope="col">Prof Rating</th>
        <th scope="col">Grading</th>
        <th scope="col">Prof Rank</th>
        <th scope="col">Prof Subject Rank</th>
        <th scope="col">Work Rating</th>
        <th scope="col">Workload</th>
        <th scope="col">Work Rank</th>
        <th scope="col">Work Subject Rank</th>
        <th scope="col">#</th>
        <th scope="col">Skills/Areas</th>
        <!-- <th scope="col">Meets</th> -->



        

      </tr>
    </thead>
    <tbody id="catalog-body">
      <!-- Dynamic table content here -->
    </tbody>
    </table>
    `
}

function createTableEle(obj, category, outerDiv, rank=false, reg_int=false, estimated=false) {
    const td = document.createElement('td')
    if (obj[category] != null) {
        if (!rank) {
                if (!reg_int) {
                    td.innerHTML = `<td>${obj[category].toFixed(2)}</td>`
                }
                else if (!estimated) {
                    td.innerHTML = `<td>${obj[category]}</td>`
                }
                else {
                    td.innerHTML = `<td>~${obj[category]}</td>`

                }
        }
        else {
            td.innerHTML = `<td>${ordinal(obj[category])}</td>`
        }

        
    }
    else {
        td.innerHTML = `<td>N/A</td>`
    }

    outerDiv.append(td)
}

function createTableEleClassed(classification, outerDiv) {

    const td = document.createElement('td')
    td.innerHTML = `<td>${classification}</td>`

    outerDiv.append(td)

}

function classifyGut(course) {
    if (course["gut_percentile"] === null || course["gut_percentile_subject"] === null) {
        return "N/A"
    }
    else if (course["gut_percentile"] >= 75 && course["gut_percentile_subject"] >= 50 && (course["workload_percentile"] != null && course["workload_percentile"] <= 25)
        && (course["workload_percentile_subject"] != null && course["workload_percentile_subject"] <= 50) && (course["professor_percentile"] != null && course["professor_percentile"] >= 75)
        && (course["professor_percentile_subject"] != null && course["professor_percentile_subject"] >= 50)) {
        
        return "Gut"
    }   
    else if ((100 >= course["gut_percentile"] && course["gut_percentile"] >= 67) || (100 >= course["gut_percentile_subject"] && course["gut_percentile_subject"] >= 67)) {
        return "Relaxed"
    }
    else if ((67 > course["gut_percentile"] && course["gut_percentile"] > 33) || (67 > course["gut_percentile_subject"] && course["gut_percentile"] > 33)) {
        return "Average"
    }
    else if (course["gut_percentile"] <= 25 && course["gut_percentile_subject"] < 50 && (course["workload_percentile"] != null && course["workload_percentile"] >= 75)
    && (course["workload_percentile_subject"] != null && course["workload_percentile_subject"] > 50) && (course["professor_percentile"] != null && course["professor_percentile"] <= 25)
            && (course["professor_percentile_subject"] != null && course["professor_percentile_subject"] < 50)) {
        return "Grueling"
    }
    else {
    // case when (33 >= course["gut_percentile"] >= 0) || (33 >= course["gut_percentile_subject"] >= 0)
        return "Challenging"
    }
}

function classifyProf(course) {
    if (course["professor_percentile"] === null || course["professor_percentile_subject"] === null) {
        return "N/A"
    }
    else if (course["professor_percentile"] >= 75 && course["professor_percentile_subject"] >= 50 && (course["workload_percentile"] != null && course["workload_percentile"] <= 25)
        && (course["workload_percentile_subject"] != null && course["workload_percentile_subject"] <= 50) && (course["professor_percentile"] != null && course["professor_percentile"] >= 75)) {
        return "Exceptional"
    }   
    else if ((100 >= course["professor_percentile"] && course["professor_percentile"] >= 67) || (100 >= course["professor_percentile_subject"] && course["professor_percentile_subject"] >= 67)) {
        return "Good"
    }
    else if ((67 > course["professor_percentile"] && course["professor_percentile"] > 33) || (67 > course["professor_percentile_subject"] && course["professor_percentile"] > 33)) {
        return "Average"
    }
    else if (course["professor_percentile"] <= 25 && course["professor_percentile_subject"] < 50 && (course["workload_percentile"] != null && course["workload_percentile"] >= 75)
    && (course["workload_percentile_subject"] != null && course["workload_percentile_subject"] > 50) && (course["professor_percentile"] != null && course["professor_percentile"] <= 25)) {
        return "Harsh"
    }
    else {
    // case when (33 >= course["gut_percentile"] >= 0) || (33 >= course["gut_percentile_subject"] >= 0)
        return "Tough"
    }
}

function classifyWork(course) {
    if (course["workload_percentile"] === null || course["workload_percentile_subject"] === null) {
        return "N/A"
    }
    else if (course["workload_percentile"] >= 67 && course["workload_percentile_subject"] >= 67) {
        return "Heavy"
    }   
    else if ((67 > course["workload_percentile"] && course["workload_percentile"] >= 33) && (67 > course["workload_percentile_subject"] && course["workload_percentile_subject"] >= 33)) {
        return "Average"
    }
    else if ((course["workload_percentile"] < 33) && (course["workload_percentile_subject"] < 33)) {
        return "Light"
    }
    else if (course["workload_percentile"] > 50 && course["workload_percentile_subject"] >= 67){
        return "Relatively Harsh"
    }
    else if (course["workload_percentile"] < 50 && course["workload_percentile_subject"] <= 33){
        return "Relatively Light"
    }
    else {
    // case when (33 >= course["gut_percentile"] >= 0) || (33 >= course["gut_percentile_subject"] >= 0)
        return "Relatively Average"
    }
}

function ordinal(n) {
    var s = ["th", "st", "nd", "rd"];
    var v = n%100;
    return n + (s[(v-20)%10] || s[v] || s[0]);
}

function season_to_str(season) {
    const season_str = '' + season

    const year = season_str.substring(0, 4)


    const season_code = season_str.substring(4, 6)
    let semester;

    if (season_code == "01") {
        semester = "Spring"
    }
    else if (season_code == "02") {
        semester = "Summer"
    } 
    else {
        semester = "Fall"
    }

    return semester + " " + year
}

function getOneCourse(id) {
    return fetch(`http://127.0.0.1:3000/courses/${id}`)
    .then(r => r.json())

}


function createOneCourse(course) {
    const tr = document.createElement('tr')
    tr.classList.add('course')
    tr.dataset.id = course.id

    let profs;

    course.professor_names === "" ? profs = "TBA" : profs = course.professor_names

    if (course.gut_index != null) {
        tr.innerHTML = `
        <td>${course.course_code}</td>
        <td>${course.title}</td>
        <td>${profs}</td>
        <td>${course.gut_index.toFixed(2)}%</td>
        <td>${classifyGut(course)}</td>
        <td>${ordinal(course.gut_percentile)}</td>
        <td>${ordinal(course.gut_percentile_subject)}</td>
        

    `
    }
    else {
        tr.innerHTML = `
        <td>${course.course_code}</td>
        <td>${course.title}</td>
        <td>${profs}</td>
        <td>N/A</td>
        <td>${classifyGut(course)}</td>
        <td>N/A</td>
        <td>N/A</td>
    `
    }

    createTableEle(course, "average_rating_same_professors", tr)
    createTableEle(course, "average_professor", tr)

    createTableEleClassed(classifyProf(course), tr)
    createTableEle(course, "professor_percentile", tr, true)
    createTableEle(course, "professor_percentile_subject", tr, true)
    createTableEle(course, "average_workload", tr)
    createTableEleClassed(classifyWork(course), tr)
    createTableEle(course, "workload_percentile", tr, true)
    createTableEle(course, "workload_percentile_subject", tr, true)
    if (course.last_enrollment_same_professors){
        createTableEle(course, "last_enrollment", tr, false, true)
    }
    else {
        createTableEle(course, "last_enrollment", tr, false, true, true)
    }


    let skills_and_areas;
    if (course.areas === "" && course.skills === "" ) {
        // console.log("N/A")
        skills_and_areas = "N/A"

    } else if ( course.skills === "") {
        // console.log(course.areas)
        skills_and_areas = course.areas.replace(',','')
    } else if ( course.areas === "") {
        // console.log(course.skills)
        skills_and_areas = course.skills.replace(',','')

    }
    else {
        // console.log(course.areas.replace(',','') + " " + course.skills.replace(',',''))
        skills_and_areas = course.areas.replace(',','') + " " + course.skills.replace(',','')

    }

    const td_areas_and_skills = document.createElement('td')

    td_areas_and_skills.textContent = skills_and_areas

    tr.append(td_areas_and_skills)

    // createTableEleClassed(course.times_summary, tr)


    const guttiness = classifyGut(course)

    // console.log(course.last_enrollment)


    // const td = document.createElement('td')
    // if (course.average_professor != null) {
        
    //     td.innerHTML = `<td>${course.average_professor.toFixed(2)}</td>`
        
    // }
    // else {
    //     td.innerHTML = `<td>N/A</td>`
    // }

    // tr.append(td)


    table.append(tr)

}

function renderAllCourses() {
    // articlesArray.forEach(function (articleObj) {
    //     createOneCard(articleObj)
    // })

    fetch('http://127.0.0.1:3000/courses', {
        method: 'GET',
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    })
        .then(r => r.json())
        .then(courses => {
            console.log(courses)
            courses.forEach(createOneCourse)
            loadMoreCourses(202103)
            main_body.dataset.id = courses[0].season_code
        })
        
}

function renderNewSeasonHome(season) {
    // articlesArray.forEach(function (articleObj) {
    //     createOneCard(articleObj)
    // })

    fetch(`http://127.0.0.1:3000/courses/${season}/new_season_home`)
        .then(r => r.json())
        .then(courses => {
            console.log(courses)
            console.log(season)
            main_body.dataset.id = courses[0].season_code
            courses.forEach(createOneCourse)
            loadMoreCourses(season)
            
        })
}


function loadMoreCourses(season) {
    // articlesArray.forEach(function (articleObj) {
    //     createOneCard(articleObj)
    // })

    fetch(`http://127.0.0.1:3000/courses/${season}/${OFFSET}/load_more`)
        .then(r => r.json())
        .then(courses => {
            console.log(courses)
            courses.forEach(createOneCourse)
        })
}

function createSeasonsList() {
    fetch('http://127.0.0.1:3000/courses/seasons')

    .then(r => r.json())
    .then(seasons => {
        console.log(seasons)
        seasons.forEach(createOneSeasonEle)
    })
}

function createOneSeasonEle(season) {
    

    const full_semester = season_to_str(season)

    li = document.createElement('li')
    li.classList.add('season')
    li.classList.add('dropdown-item')
    li.dataset.id = season

    li.textContent = full_semester


    seasons_dropdown.append(li)




}

seasons_dropdown.addEventListener('click', event => {
    if (event.target.matches('li.season')) {
        const season = parseInt(event.target.dataset.id)

        const table_name = document.querySelector('main div h1#table-title')

        table_name.textContent = season_to_str(season) + " Catalog"

        table.innerHTML = ""

        renderNewSeasonHome(season)
        // loadMoreCourses(season)
    }
})



// let scrolled_once = false

// document.addEventListener('scroll', event => {
//     if (!scrolled_once) {

//         loadMoreCourses(202103)
//         scrolled_once = true
//     }
        
// })

main_body.addEventListener('click', event => {
    if (event.target.matches('tbody td')) {
        const tr = event.target.closest('tr')
        const id = tr.dataset.id
        console.log(id)
        main_body.innerHTML = ""


        const btn = document.createElement('a')
        btn.classList.add('btn-primary')
        btn.classList.add('btn')
        btn.onclick = () => { 
            main_body.innerHTML = ""
            refreshTable()
            table = document.querySelector('tbody#catalog-body')

            const curr_season = main_body.dataset.id

            renderNewSeasonHome(curr_season)
            const table_name = document.querySelector('main div h1#table-title')

            table_name.textContent = season_to_str(curr_season) + " Catalog"
    
         }
        btn.innerHTML = "Back to Catalog"

        main_body.append(btn)

        const table_name = document.querySelector('main div h1#table-title')

        const comments_section = document.createElement('section')

        comments_section.classList.add("comments")


    
        


        clicked_course = getOneCourse(id)

        // console.log(clicked_course)

        clicked_course.then(course => {

            table_name.textContent = course.title + ` (${season_to_str(course.season_code)})`

            table_name.dataset.id = id

            const section = document.createElement('section')

            console.log(course.syllabus_url)

            let syll_url;

            comments_section.innerHTML = `
    
            <div class="container mt-5 mb-5" id="comments">
                <div class="d-flex justify-content-center row">
                    <div class="d-flex flex-column col-md-12">
                        <div class="d-flex flex-row align-items-center text-left comment-top p-2 bg-white border-bottom px-4">
                           
                            
                            <div class="d-flex flex-column ml-3">
                                <div class="d-flex flex-row post-title">
                                    <h5>Comments</h5><span class="ms-2">(${course.comments.length})</span>
                                </div>

                            </div>
                        </div>
                        <div class="coment-bottom bg-white p-2 px-4">
                            <form id="comment-form">
                                <div class="d-flex flex-row input-group mt-4 mb-4">
                                    <textarea class="form-control" placeholder="Add comment" aria-label="With textarea"></textarea>
                                    <button type="submit" class="btn btn-primary">Comment</button>
                                </div>
                            </form>
                            <div id="comments-container">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

       
        `

     

            if (course.syllabus_url === null) {
                syll_url = `
                    <div class="CourseModalOverview_metadata__2fCzj col-sm-9 col-8">
                        <div class="px-0 col-sm-3 col-4"><span>N/A</span></div>
                    </div>
                `
            }
            else {
                syll_url = `
                <div class="CourseModalOverview_metadata__2fCzj col-sm-9 col-8">
                    <a target="_blank" rel="noopener noreferrer" href="${course.syllabus_url}" class="d-flex">
                    View Syllabus
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" class="ml-1 my-auto" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                        </svg>
                    </a>
                </div>
                `
    
            }

            const meets = checkIfBlank(course, "times_summary", true)

            const location = checkIfBlank(course, "locations_summary", true)


    

            section.innerHTML = `
            <div class="m-auto row">
            <div class="px-0 mt-0 mb-3 col-md-5">
               <div class="mx-auto row">
                  <div class="LinesEllipsis  " style="white-space: pre-wrap;">${course.description}<wbr></div>
               </div>
               <div class="m-auto pt-4 pb-2 row">
                  <div class="px-0 col-sm-3 col-4"><span class="CourseModalOverview_lable_bubble__20zUT">Syllabus</span></div>
                    ${syll_url}
               </div>
               <div class="m-auto py-2 row">
                  <div class="px-0 col-sm-3 col-4"><span class="CourseModalOverview_lable_bubble__20zUT">Professor</span></div>
                  <div class="CourseModalOverview_metadata__2fCzj col-sm-9 col-8"><span class="sc-jrQzUz jUiVDr">${course.professor_names}</span></div>
               </div>
               <div class="m-auto py-2 row">
                  <div class="px-0 col-sm-3 col-4"><span class="CourseModalOverview_lable_bubble__20zUT">Meets</span></div>
                  <div class="CourseModalOverview_metadata__2fCzj col-sm-9 col-8">${meets}</div>
               </div>
               <div class="m-auto py-2 row">
                  <div class="px-0 col-sm-3 col-4"><span class="CourseModalOverview_lable_bubble__20zUT">Location</span></div>
                  <div class="CourseModalOverview_metadata__2fCzj col-sm-9 col-8">${location}</div>
               </div>
               <div class="m-auto py-2 row">
                  <div class="px-0 col-sm-3 col-4"><span class="CourseModalOverview_lable_bubble__20zUT">Section</span></div>
                  <div class="CourseModalOverview_metadata__2fCzj col-sm-9 col-8">1</div>
               </div>
               <div class="m-auto py-2 row">
                  <div class="px-0 col-sm-3 col-4"><span class="CourseModalOverview_lable_bubble__20zUT">Enrollment</span></div>
                  <div class="CourseModalOverview_metadata__2fCzj col-sm-9 col-8">75</div>
               </div>
               <div class="m-auto py-2 row">
                  <div class="px-0 col-sm-3 col-4"><span class="CourseModalOverview_lable_bubble__20zUT">Credits</span></div>
                  <div class="CourseModalOverview_metadata__2fCzj col-sm-9 col-8">1</div>
               </div>
            </div>
            <div class="px-0 my-0 col-md-7">
               <div tabindex="0" class="CourseModalOverview_filter_container__2dv71 m-auto justify-content-center row">
                  <div class="toggle-wrapper">
                     <div class="toggleContainer sc-hOGjNT gkxjWz CourseModalOverview_evaluations_filter__15lI6 mb-2">
                        <div class="toggleOption" style="width: 33.3333%;">Course (1)</div>
                        <div class="toggleOption selected" style="width: 33.3333%;">Both (1)</div>
                        <div class="toggleOption" style="width: 33.3333%;">Prof (20)</div>
                        <div class="toggle" style="width: 33.3333%; transform: translateX(100%);"></div>
                     </div>
                  </div>
               </div>
               <div class="m-auto pb-1 justify-content-center row">
                  <div class="d-flex justify-content-center px-0 mr-3 col-5"><span class="CourseModalOverview_evaluation_header__3tqxo">Season</span></div>
                  <div class="d-flex ml-0 justify-content-center px-0 col-2"><span class="CourseModalOverview_evaluation_header__3tqxo">Class</span></div>
                  <div class="d-flex ml-0 justify-content-center px-0 col-2"><span class="CourseModalOverview_evaluation_header__3tqxo">Prof</span></div>
                  <div class="d-flex ml-0 justify-content-center px-0 col-2"><span class="CourseModalOverview_evaluation_header__3tqxo">Work</span></div>
               </div>
               <div class="m-auto py-1 justify-content-center row">
                  <div class="sc-bTfYlY cEVPjL CourseModalOverview_rating_bubble__31UGC  px-0 mr-3 text-center col-5" style="flex: 0 0 auto;">
                     <strong>Fall 2019</strong>
                     <div class="CourseModalOverview_details__3Yi_F mx-auto CourseModalOverview_shown__po4mh">Section 1</div>
                  </div>
                  <div class="px-1 ml-0 d-flex justify-content-center text-center col-2">
                     <div class="sc-pVTma hTudOk CourseModalOverview_rating_cell__3jrJ6 undefined">3.9</div>
                  </div>
                  <div class="px-1 ml-0 d-flex justify-content-center text-center col-2">
                     <div class="sc-pVTma dmsDBh CourseModalOverview_rating_cell__3jrJ6">4.0</div>
                  </div>
                  <div class="px-1 ml-0 d-flex justify-content-center text-center col-2">
                     <div class="sc-pVTma bUlwbR CourseModalOverview_rating_cell__3jrJ6">3.3</div>
                  </div>
               </div>
            </div>
         </div>
            `



            main_body.append(section)
            main_body.append(comments_section)
            // main_body.append(new_comment)

            course.comments.forEach(comment => {
                createOneComment(comment)
            })

            const comment_form = document.querySelector('form#comment-form')

            comment_form.addEventListener('submit', event => {
                event.preventDefault()

                const comments_div = document.querySelector('div#comments')

                const student_id = null

                const content = event.target[0].value

                const course_id = course.id

                const vote_score = 0


                const commentObj = {
                    student_id,
                    content, 
                    course_id,
                    vote_score
                }

                comment_form.reset()
                fetch('http://localhost:3000/comments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(commentObj)
                })
                    .then(r => r.json())
                    .then(createOneComment)



            })



        })
    }
})

searchForm.addEventListener('submit', event => {
    event.preventDefault()

    search()
})



renderAllCourses()

createSeasonsList()

// test()

// scroll event listener 

// offset SQL query 


