
async function cancelClass(id) {
    const reason = prompt("Are you sure you want to cancel the class? If yes, please write the reason.");
    console.log(reason);
    if (reason) {
        console.log(typeof(reason));
        const classId = id;
        console.log(typeof(classId));
        const requestBody = JSON.stringify({ reason });
        const response = await fetch(`./cancel/${classId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        });
        if (response.ok) {
            alert('Class canceled successfully.');
        } else {
            alert('Failed to cancel the class.');
        }
    }
};