document.addEventListener("DOMContentLoaded", () => {
  const dataList = document.getElementById("data-list");
  const dataForm = document.getElementById("data-form");
  const dataInput = document.getElementById("data-input");

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await fetch("/data");
      const data = await response.json();
      dataList.innerHTML = ""; // Clear the list before rendering
      data.forEach((item) => {
        const li = document.createElement("li");

        const recentTaskSpan = document.createElement("span");
        recentTaskSpan.innerHTML = item.text;

        //create buttons
        const editButton = document.createElement("button");
        editButton.innerHTML = "Edit";

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        //store item id inside delete button
        deleteButton.setAttribute("data-id", item.id);

        deleteButton.addEventListener("click", async () => {
          await deleteItem(item.id);
        });

        let editInput = document.createElement("input");
        let saveButton = document.createElement("button");

        editInput.value = li.textContent;
        saveButton.innerHTML = "Save";

        editButton.addEventListener("click", () => {
          recentTaskSpan.style.display = "none";
          editButton.style.display = "none";
          editInput.value = item.text;
          li.append(editInput, saveButton);
        });

        saveButton.addEventListener("click", async () => {
          await updateItem(item.id, editInput.value);
          recentTaskSpan.style.display = "inline";
          editButton.style.display = "inline";
          editInput.remove();
          saveButton.remove();
        });

        li.append(recentTaskSpan, editButton, deleteButton);

        dataList.appendChild(li);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Handle form submission to add new data
  dataForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newData = { text: dataInput.value };

    try {
      const response = await fetch("/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        dataInput.value = ""; // Clear input field
        fetchData(); // Refresh the list
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  });

  //handle form submission to delete item
  const deleteItem = async (id) => {
    try {
      console.log(id);
      const response = await fetch(`/data/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchData();
      } else {
        console.error("failed to delete");
      }
    } catch (error) {
      console.error("error deleteing ", error);
    }
  };

  //handle form submission to update/ put item

  const updateItem = async (id, newtext) => {
    try {
      console.log(id);
      const response = await fetch(`/data/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newtext }),
      });
      if (response.ok) {
        fetchData();
      } else {
        console.error("failed to delete");
      }
    } catch (error) {
      console.error("error deleteing ", error);
    }
  };

  // Fetch data on page load
  fetchData();
});
