

document.querySelectorAll('.place-order').forEach(button => {

    button.addEventListener('click', () => {

        const address = button.getAttribute('data-addres');
        console.log(address);

        const radio = document.getElementsByName('payment');
        let paymentMethod = 0
        for (let i = 0; i < radio.length; i++) {
            if (radio[i].checked) {
                paymentMethod = radio[i].value
            }
        }

        if (paymentMethod == 0) {
            Swal.fire({
                text: "please select an payment method !",
                icon: "warning"
            });
        }else{
            Swal.fire({
                title :"Confirm Order",
                text: 'Are you sure you want to proceed ?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, place order!'
              }).then((result) => {
                if (result.isConfirmed) {
                   fetch('/place-order',{
                    method  : 'POST',
                    headers : {
                        'Content-Type': 'application/json'
                    },
                    body : JSON.stringify({
                        address , paymentMethod
                    })
                   }).then(response=>{
                    return response.json()
                   }).then(data=>{
                    if(data){
                        let value = data.value
                               console.log(value);
                        if(value==0){
                            setTimeout(() => {
                                location.href = '/order-placed'
                            },1000);
                        }else{
                            Swal.fire('Order Placed!', 'sorry, failed to place the order !', 'error');
                        }
                    }
                   }).catch(error=>{
                    console.log(error);
                   })

                }
              });
        }


    })
});























// const swalWithBootstrapButtons = Swal.mixin({
//     customClass: {
//         confirmButton: "btn btn-success",
//         cancelButton: "btn btn-danger"
//     },
//     buttonsStyling: false
// });
// swalWithBootstrapButtons.fire({
//     title: "Are you sure?",
//     text: "You won't be able to revert this!",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonText: "Yes, delete it!",
//     cancelButtonText: "No, cancel!",
//     reverseButtons: true
// }).then((result) => {
//     if (result.isConfirmed) {
//         swalWithBootstrapButtons.fire({
//             title: "Deleted!",
//             text: "Your file has been deleted.",
//             icon: "success"
//         });
//     } else if (
//         /* Read more about handling dismissals below */
//         result.dismiss === Swal.DismissReason.cancel
//     ) {
//         swalWithBootstrapButtons.fire({
//             title: "Cancelled",
//             text: "Your imaginary file is safe :)",
//             icon: "error"
//         });
//     }
// });