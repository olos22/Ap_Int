class MapPuzzle
{
    constructor()
    {
        this.map = L.map('map').setView([53.430127, 14.564802], 18);
        this.marker = L.marker([53.430127, 14.564802]).addTo(this.map);
        this.wrongElements = 16;

        this.initMap();
        this.createGrid();
        this.setupEventListeners();
        this.requestPermissions();

        setTimeout(() =>
        {
            this.map.invalidateSize();
        }, 500);
    }
    initMap()
    {
        L.tileLayer.provider('Esri.WorldImagery').addTo(this.map);
    }
    createGrid()
    {
        const mainPuzzle = document.getElementById("puzzle");
        const table = document.createElement("table");
        table.id = "grid";

        for (let row = 0; row < 4; row++)
        {
            const tr = document.createElement("tr");

            for (let col = 0; col < 4; col++)
            {
                const td = document.createElement("td");
                tr.appendChild(td);
            }

            table.appendChild(tr);
        }
        mainPuzzle.appendChild(table);
    }
    requestPermissions()
    {
        Notification.requestPermission();

        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(
                () => console.log("Geolocation granted"),
                () => console.log("Geolocation denied")
            );
        }
    }
    setupEventListeners()
    {
        document.getElementById("saveMap").addEventListener("click", () => this.saveMap());
        document.getElementById("getLocation").addEventListener("click", () => this.getLocation());

        this.setupDragAndDrop();
    }
    setupDragAndDrop()
    {
        const cells = document.querySelectorAll("#grid td");

        cells.forEach((cell, index) =>
        {
            const x = index % 4;
            const y = Math.floor(index / 4);
            cell.dataset.posX = x;
            cell.dataset.posY = y;

            cell.addEventListener("dragenter", () =>
            {
                cell.style.border = "2px solid #7FE9D9";
            });

            cell.addEventListener("dragleave", () =>
            {
                cell.style.border = "1px dashed #7f7fe9";
            });

            cell.addEventListener("dragover", (e) =>
            {
                e.preventDefault();
            });

            cell.addEventListener("drop", (e) =>
            {
                e.preventDefault();
                cell.style.border = "1px dashed #7f7fe9";
                this.handleDrop(e, cell);
            });
        });

        document.addEventListener("dragstart", (e) =>
        {
            if (e.target.classList.contains("element"))
            {
                e.dataTransfer.setData("text", e.target.id);
            }
        });
    }
    handleDrop(e, cell)
    {
        const elementID = e.dataTransfer.getData("text");
        const element = document.getElementById(elementID);
        let changed = false;

        if (cell.firstChild)
        {
            const elementsContainer = document.getElementById("elements");
            elementsContainer.appendChild(cell.firstChild);
            changed = true;
        }

        cell.appendChild(element);
        const isElementCorrect = this.checkElementPosition(element, cell);
        this.updatePuzzleData(changed, isElementCorrect);
    }
    checkElementPosition(element, cell)
    {
        const correctXaxis = element.dataset.correctXaxis;
        const correctYaxis = element.dataset.correctYaxis;
        const cellX = cell.dataset.posX;
        const cellY = cell.dataset.posY;

        return correctXaxis === cellX && correctYaxis === cellY;
    }
    updatePuzzleData(wasElementReplaced, isElementCorrect)
    {
        if (isElementCorrect)
        {
            this.wrongElements -= 1;
        }
        else
        {
            if (wasElementReplaced)
            {
                this.wrongElements += 1;
            }
        }
        if (this.wrongElements < 1)
        {
            this.notifyCompletion();
        }
    }
    notifyCompletion()
    {
        if (!("Notification" in window))
        {
            alert("Ta przeglądarka nie obsługuje powiadomień");
            return;
        }
        if (Notification.permission === "granted")
        {
            new Notification("Wszystkie elementy są na swoim miejscu!");
            console.log("Wszystkie elementy są na swoim miejscu!")
        }
        else if (Notification.permission !== "denied")
        {
            Notification.requestPermission().then((permission) =>
            {
                if (permission === "granted")
                {
                    new Notification("Wszystkie elementy są na swoim miejscu!");
                }
            });
        }
    }
    saveMap()
    {
        this.map.invalidateSize();
        setTimeout(() =>
        {
            leafletImage(this.map, (err, canvas) =>
            {
                if (err)
                {
                    console.error(err);
                    return;
                }

                const canvasWidth = 900;
                const canvasHeight = 616;
                const elementsRowAmount = 4;
                const elementWidth = canvasWidth / elementsRowAmount;
                const elementHeight = canvasHeight / elementsRowAmount;

                const elements = [];

                for (let y = 0; y < elementsRowAmount; y++)
                {
                    for (let x = 0; x < elementsRowAmount; x++)
                    {
                        const elementCanvas = document.createElement("canvas");
                        elementCanvas.width = elementWidth;
                        elementCanvas.height = elementHeight;
                        const context = elementCanvas.getContext("2d");

                        context.drawImage(
                            canvas,
                            x * elementWidth,
                            y * elementHeight,
                            elementWidth,
                            elementHeight,
                            0,
                            0,
                            elementWidth,
                            elementHeight
                        );

                        const img = document.createElement("img");
                        img.src = elementCanvas.toDataURL();
                        img.height = elementHeight;
                        img.width = elementWidth;
                        img.classList.add("element");
                        img.draggable = true;
                        img.dataset.correctXaxis = x;
                        img.dataset.correctYaxis = y;

                        elements.push(img);
                    }
                }
                this.shuffleArray(elements);
                this.createElementsContainer(elements);
            });
        }, 500);
    }
    shuffleArray(array)
    {
        for (let i = array.length - 1; i > 0; i--)
        {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    createElementsContainer(elements)
    {
        const existingContainer = document.getElementById("elements");
        if (existingContainer)
        {
            existingContainer.remove();
        }

        const elementContainer = document.createElement("div");
        elementContainer.id = "elements";

        elements.forEach((element, index) =>
        {
            element.id = `element-${index}`;
            elementContainer.appendChild(element);
        });

        document.body.appendChild(elementContainer);
    }
    getLocation()
    {
        if (!navigator.geolocation)
        {
            console.log("Geolokacja nie jest dostępna");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) =>
            {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                this.map.setView([lat, lon]);
                this.map.eachLayer((layer) =>
                {
                    if (layer instanceof L.Marker)
                    {
                        this.map.removeLayer(layer);
                    }
                });
                this.marker = L.marker([lat, lon]).addTo(this.map);
            },
            (error) =>
            {
                console.error("Błąd geolokacji:", error);
            }
        );
    }
}
const mapPuzzle = new MapPuzzle();