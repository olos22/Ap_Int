class Todo 
{
    constructor() 
    {
        this.tasks = [];
        this.listContainer = document.getElementById("taskList");
        this.searchInput = document.getElementById("search");
        this.term = "";

        this.load();
        this.draw();
        this.searchInput.addEventListener("input", () => 
        {
            this.term = this.searchInput.value.trim().toLowerCase();
            this.draw();
        });
    }
    get filteredTasks() 
    {
        if (this.term.length < 2) 
        {
            return this.tasks;
        }
        return this.tasks.filter(task => 
            task.text.toLowerCase().includes(this.term)
        );
    }
    add(taskText, deadline) 
    {
        if (taskText.length < 3 || taskText.length > 255) 
        {
            alert("Zadanie musi mieć od 3 do 255 znaków.");
            return;
        }
        if (deadline) 
        {
            const now = new Date();
            const chosen = new Date(deadline);
            if (chosen <= now) 
            {
                alert("Termin musi być w przyszłości!");
                return;
            }
        }
        this.tasks.push(
        {
            text: taskText,
            deadline: deadline || null,
        });

        this.save();
        this.draw();
    }
    remove(index) 
    {
        const filteredIndex = this.getRealIndexFromFiltered(index);
        if (filteredIndex !== -1) 
        {
            this.tasks.splice(filteredIndex, 1);
            this.save();
            this.draw();
        }
    }
    getRealIndexFromFiltered(filteredIndex) 
    {
        if (this.term.length < 2) 
        {
            return filteredIndex;
        }
        const filteredTasks = this.filteredTasks;
        if (filteredIndex >= 0 && filteredIndex < filteredTasks.length) 
        {
            const task = filteredTasks[filteredIndex];
            return this.tasks.indexOf(task);
        }
        return -1;
    }
    edit(index, newText, newDeadline = null) 
    {
        if (newText.length < 3 || newText.length > 255) return;
        
        if (newDeadline) {
            const now = new Date();
            const chosen = new Date(newDeadline);
            if (chosen <= now) {
                alert("Termin musi być w przyszłości!");
                return;
            }
        }
        const realIndex = this.getRealIndexFromFiltered(index);
        if (realIndex !== -1) 
        {
            this.tasks[realIndex].text = newText;
            this.tasks[realIndex].deadline = newDeadline;
            this.save();
            this.draw();
        }
    }
    draw() 
    {
        this.listContainer.innerHTML = "";
        const filteredTasks = this.filteredTasks;

        filteredTasks.forEach((task, index) => 
        {
            const div = document.createElement("div");
            div.classList.add("task");

            let displayedText = task.text;
            if (this.term.length >= 2) 
            {
                const regex = new RegExp(`(${this.term})`, "gi");
                displayedText = task.text.replace(regex, `<mark>$1</mark>`);
            }

            let formattedDate = "";
            if (task.deadline) 
            {
                const [year, month, day] = task.deadline.split("-");
                formattedDate = `${day}.${month}.${year}`;
            }
            div.innerHTML = `
                <span class="taskText">${displayedText}</span>
                ${formattedDate ? `<span class="deadline">${formattedDate}</span>` : "<span class='no-deadline'>Brak terminu</span>"}
                <button class="deleteBtn">X</button>
            `;
            
            const taskContent = div.querySelector(".taskText").parentNode;
            taskContent.addEventListener("click", (e) => 
            {
                if (div.classList.contains("editing")) return;
                if (e.target.classList.contains("deleteBtn")) return;
                
                div.classList.add("editing");
                
                const originalText = task.text;
                const originalDeadline = task.deadline;
                
                const textInput = document.createElement("input");
                textInput.type = "text";
                textInput.value = task.text;
                textInput.classList.add("edit-input");
                div.querySelector(".taskText").replaceWith(textInput);
                
                const dateInput = document.createElement("input");
                dateInput.type = "date";
                dateInput.classList.add("edit-date");
                
                if (task.deadline) 
                {
                    dateInput.value = task.deadline;
                } 
                else 
                {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    dateInput.value = tomorrow.toISOString().split('T')[0];
                }
                
                const deadlineElement = div.querySelector(".deadline") || div.querySelector(".no-deadline");
                deadlineElement.replaceWith(dateInput);
                
                textInput.focus();
                textInput.select();
                
                const saveChanges = () => 
                {
                    const newText = textInput.value.trim();
                    const newDeadline = dateInput.value || null;
                    
                    if (newText.length >= 3 && newText.length <= 255) 
                    {
                        this.edit(index, newText, newDeadline);
                    }
                    else 
                    {
                        this.edit(index, originalText, originalDeadline);
                    }
                    
                    div.classList.remove("editing");
                };
                const cancelChanges = () => 
                {
                    this.draw();
                };
                textInput.addEventListener("keydown", (e) => 
                {
                    if (e.key === "Enter") 
                    {
                        saveChanges();
                    }
                    else if (e.key === "Escape") 
                    {
                        cancelChanges();
                    }
                });
                dateInput.addEventListener("keydown", (e) => 
                {
                    if (e.key === "Enter") 
                    {
                        saveChanges();
                    }
                    else if (e.key === "Escape") 
                    {
                        cancelChanges();
                    }
                });
                textInput.addEventListener("blur", () => 
                {
                    setTimeout(() => 
                    {
                        if (!div.contains(document.activeElement)) 
                        {
                            saveChanges();
                        }
                    }, 10);
                });
                dateInput.addEventListener("blur", () => 
                {
                    setTimeout(() => 
                    {
                        if (!div.contains(document.activeElement)) 
                        {
                            saveChanges();
                        }
                    }, 10);
                });
            });
            div.querySelector(".deleteBtn").addEventListener("click", (e) => 
            {
                e.stopPropagation();
                this.remove(index);
            });
            
            this.listContainer.appendChild(div);
        });
    }
    save() 
    {
        localStorage.setItem("todoTasks", JSON.stringify(this.tasks));
    }
    load() 
    {
        const data = localStorage.getItem("todoTasks");
        if (data)
        {
            this.tasks = JSON.parse(data);
        }
    }
}
const todo = new Todo();

document.getElementById("addTaskBtn").addEventListener("click", () => 
{
    const text = document.getElementById("taskInput").value.trim();
    const deadline = document.getElementById("taskDeadline").value;
    todo.add(text, deadline);
    document.getElementById("taskInput").value = "";
    document.getElementById("taskDeadline").value = "";
});

document.getElementById("taskInput").addEventListener("keypress", (e) => 
{
    if (e.key === "Enter") 
    {
        document.getElementById("addTaskBtn").click();
    }
});