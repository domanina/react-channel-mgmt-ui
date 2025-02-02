import Swal from "sweetalert2";

const DeleteConfirmationAlert = async () => {
    return await Swal.fire({
        title: 'Delete Item?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        reverseButtons: true
    });
};

export default DeleteConfirmationAlert;
