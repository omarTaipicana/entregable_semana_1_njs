const http = require("http");
const path = require("path");
const fs = require("fs/promises");

const PORT = 8000;
const app = http.createServer(async (request, response) => {
    const method = request.method
    const url = request.url
    const jsonPath = path.resolve("./data.json");
    const jsonFile = await fs.readFile(jsonPath, "utf8");
    const taskexample = {
        id: 0,
        title: 'Title',
        description: 'Description',
        status: false
    }
    if (url === "/task" && method === "GET") {
        response.setHeader("Content-Type", "application/json");
        response.writeHead("200");
        response.write(jsonFile);
    }
    if (url === "/task" && method === "POST") {
        request.on("data", (data) => {
            const arr = JSON.parse(jsonFile);
            const nweTask = {
                ...taskexample,
                id: arr[arr.length - 1]["id"] + 1,
                ...JSON.parse(data)
            };
            arr.push(nweTask);
            fs.writeFile(jsonPath, JSON.stringify(arr))
            console.log(arr);
        });
        response.writeHead("201");
    }
    if (method === "PUT") {

        request.on("data", (data) => {
            const id = parseInt(request.url.split("/").at(-1))
            const newTask = JSON.parse(data);
            const arr = JSON.parse(jsonFile);
            fs.writeFile(jsonPath,
                JSON.stringify(arr.map(task => (
                    {
                        ...task, ...(task.id == id && newTask)
                    }
                ))))
        });
        response.writeHead("202");
    }
    if (method === "DELETE") {
        const id = parseInt(request.url.split("/").at(-1));
        const arr = JSON.parse(jsonFile);
        fs.writeFile(jsonPath,
            JSON.stringify(arr.filter(task => task.id != id)
            )
        )
        response.writeHead("202");
    }
    response.end();
});

app.listen(PORT);

console.log("servidor corriendo")






