/*//////////////////////////////////////////
   Treehouse FSJS Techdegree Unit 2 Project
   List Filter and Pagination
//////////////////////////////////////////*/

//creating a variable called studentList and storing list item elements.
let StudentList = document.querySelector("ul.student-list");

// Array of all students in list
const totalStudents = [...StudentList.children];

//creating a variable to store the number of items for each page.
const ListShowPage = (list, pageNumber, itemsNumperPage) => {
   // Calculate index of first item to display
   const StartIndex = (pageNumber - 1) * itemsNumperPage;

   // Calculate index of last item to display 
   const EndIndex = StartIndex + itemsNumperPage - 1

   //for loop for hosw items are displayed 
   for (let i = 0; i < list.length; i++) {
      if (i < StartIndex || i > EndIndex) {
         list[i].style.display = "none";  // Hide element
      } else {
         list[i].style.display = "";      // Show element
      }
   }

   //scrolling up to the top of the page
   window.scrollTo(0, 0);
}


const appendPageLinks = (list, itemsNumperPage) => {
   //selecting page div 
   const pageDiv = document.querySelector("div.page");

   //getting the current pagination div.
   const presentPagination = document.querySelector("div.pagination");

   /// creating an if statement remove a pagination if it already exist in the div;
   if (presentPagination !== null) {
      pageDiv.removeChild(presentPagination);
   }

   //calculating number of pages to generate links on
   const NumofPages = Math.ceil(list.length / itemsNumperPage);

   //creating the pagination div and assigning it the pagination class
   const paginationDiv = document.createElement("div");
   paginationDiv.classList.add("pagination");

   //creating an unordered list for the pagination list
   const ul = document.createElement("ul");

   //addind buttons to each page
   for (let i = 1; i <= NumofPages; i++) {
      // Create list item
      const li = document.createElement("li");

      // Create anchor for page
      const a = document.createElement("a");

      //making the first page active and showing it first 
      if (i === 1) {
         a.classList.add("active");
         ListShowPage(list, 1, itemsNumperPage);
      }

      //setting the text content to the page number.
      a.innerText = i;

      //adding EventListener to anchor in make only the page linked active
      a.addEventListener("click", e => {
         // stopping anchor from navigating to a new link.
         e.preventDefault();

         //removing active class of previous active anchor
         const previousActiveAnchor = document.querySelector("a.active");
         previousActiveAnchor.classList.remove("active");

         //adding active class to anchor which was clicked.
         e.target.classList.add("active");

         //showing students on page that anchor is linking to
         ListShowPage(list, i, itemsNumperPage);
      });

      //appending anchor to list item
      li.appendChild(a);

      //appending list item to ul
      ul.appendChild(li);
   }

   //appending ul to the pagination div
   paginationDiv.appendChild(ul);

   // Get items per page div, if present (won't be on initial page load)
   const itemsPerpageDiv = document.querySelector("div.items-num-per-page");

   // If it is present,
   if (itemsPerpageDiv !== null) {
      // Insert pagination before items per page div
      pageDiv.insertBefore(paginationDiv, itemsPerpageDiv)
   } else {
      // Otherwise, append pagination to page div
      pageDiv.appendChild(paginationDiv);
   }
}


// Append search functionality
const appendSearch = listElement => {
   // Create search div, giving it the student-search class
   const searchDiv = document.createElement("div");
   searchDiv.classList.add("student-search");

   // Create input element, with placeholder text
   const input = document.createElement("input");
   input.placeholder = "Search for students";

   // Create search button, with search text
   const button = document.createElement("button");
   button.innerText = "Search";



   // Define search handler
   const searchHandler = () => {
      // Get the "no results" list item, if present
      let noResultsListItem = document.querySelector("li.noresults");

      // If it is present, remove it
      if (noResultsListItem !== null) {
         listElement.removeChild(noResultsListItem);
      }

      let results = [];

      // Iterate through entire list of students
      for (let i = 0; i < totalStudents.length; i++) {

         // creating an if statement to remove all students from list element,
         // except for those already removed from previous searches

         if (listElement.contains(totalStudents[i])) {
            listElement.removeChild(totalStudents[i]);
         }

         // Get details div of student
         const details = totalStudents[i].children[0];

         // Get name and email address of student
         const name = details.children[1].textContent;
         const email = details.children[2].textContent;

         // If...
         if (
            name.includes(input.value.toLowerCase()) ||  // making search by name flexible
            email.includes(input.value.toLowerCase())    // making search by email flexible
         ) {
            // Then add that student to the list of results
            results.push(totalStudents[i]);
         }
      }

      // If statement for when there is no results
      if (results.length === 0) {
         // Get current pagination, if present
         const pagination = document.querySelector("div.pagination");

         // Removing pagination if it exists
         if (pagination !== null){
            pagination.remove();
         }
         // Create new list item, giving it the noresults class
         const noResults = document.createElement("li");
         noResults.classList.add("noresults");

         // Create paragraph element
         const p = document.createElement("p");

         // Set "no results found" text, specifying the search term
         p.innerText = `No results found for the search term "${input.value}".`;

         // Append paragraph to list item
         noResults.appendChild(p);

         // Append list item to list
         listElement.appendChild(noResults);
      }

      // Append each result to the list element
      results.forEach(result => listElement.appendChild(result));

      // Get number of items to display per page
      const itemsPerPage = parseInt(document.querySelector("select#ipp").value);


      //Update the pagination links for the new results, making it display number of items num per page

      appendPageLinks(listElement.children, itemsPerPage);
   }
   // Apply search handler when button is clicked
   button.addEventListener("click", searchHandler);

   // Also apply search handler when input field changes
   input.addEventListener("keyup", searchHandler);



   // Append input and button to search div
   searchDiv.appendChild(input);
   searchDiv.appendChild(button);



   // Get page header div
   const pageHeader = document.querySelector("div.page-header");

   // Append search div to page header
   pageHeader.appendChild(searchDiv);


};


// Add pagination links, items per page functionality, and search functionality for students on page load
const PageLoad = () => {
   // Append page links for all students, 10 items per page by default
   appendPageLinks(totalStudents, 10);

   // Create items per page div, with the items-per-page class
   const itemsPerpageDiv = document.createElement("div");
   itemsPerpageDiv.classList.add("items-num-per-page");

   // Create items per page label for ipp select element
   const itemsperpageLabel = document.createElement("label");
   itemsperpageLabel.htmlFor = "ipp";
   itemsperpageLabel.innerText = "Items num per page:";

   // Create items per page select element with ipp ID
   const itemperpageSelect = document.createElement("select");
   itemperpageSelect.id = "ipp";

   // Items per page option data
   const itemperpageOptionData = [10, 15, 20, 25, 40, 50,];

   // Create option element for each option value
   itemperpageOptionData.forEach(optionValue => {
      const option = document.createElement("option");

      option.value = optionValue;
      option.innerText = optionValue.toString();

      itemperpageSelect.appendChild(option);
   });

   // Append items per page label and select to respective div
   itemsPerpageDiv.appendChild(itemsperpageLabel);
   itemsPerpageDiv.appendChild(itemperpageSelect);

   // Get page div
   const pageDiv = document.querySelector("div.page");

   // Append items per page div to page div
   pageDiv.appendChild(itemsPerpageDiv);

   // When the items per page value changes, update pagination accordingly
   itemperpageSelect.addEventListener("change", () => appendPageLinks(StudentList.children, parseInt(itemperpageSelect.value)));

   // Append search functionality
   appendSearch(StudentList);
}

// Run PageLoad function when page loads
window.onload = PageLoad;