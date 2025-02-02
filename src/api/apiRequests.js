import env from "../config/enviLoad";
import Swal from "sweetalert2";


export function showErrorAlert(error) {
    const message = error.message || 'Unexpected error occurred';
    console.error(message, error);
    Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonText: 'Ok'
    });
}


export async function getItems(queryParams = {}) {
    try {
        const url = new URL(`${env.REACT_APP_BASE_URL}/...`);
        Object.keys(queryParams).forEach(key => {
            url.searchParams.append(key, queryParams[key]);
        });

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'api-key': env.REACT_APP_API_KEY
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            showErrorAlert(new Error(`API error: ${errorText}`));
            throw new Error(`API error: ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        showErrorAlert(error);
        throw error;
    }
}


export async function addItem(data) {
    try {
        const response = await fetch(`${env.REACT_APP_BASE_URL}/...`, {
            method: 'POST',
            headers: {
                'api-key': env.REACT_APP_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            showErrorAlert(new Error(`API error: ${errorText}`));
            throw new Error(`API error: ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        showErrorAlert(error);
        throw error;
    }
}


export async function uploadImage(base64Image, nameFile) {
    try {
        const fileExtension = nameFile.split('.').pop();
        const mimeType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;

        const dataForm = new FormData();
        dataForm.append('file', new Blob([base64Image], { type: mimeType }), nameFile);

        const response = await fetch(`${env.REACT_APP_BASE_URL}/...`, {
            method: 'POST',
            headers: {
                'api-key': env.REACT_APP_API_KEY
            },
            body: dataForm
        });

        if (!response.ok) {
            const errorText = await response.text();
            showErrorAlert(new Error(`API error: ${errorText}`));
            throw new Error(`API error: ${errorText}`);
        }
        return nameFile;
    } catch (error) {
        showErrorAlert(error);
        throw error;
    }
}
