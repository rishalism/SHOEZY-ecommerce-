

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
        } else {
            Swal.fire({
                title: "Confirm Order",
                text: 'Are you sure you want to proceed ?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, place order!'
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch('/place-order', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            address, paymentMethod
                        })
                    }).then(response => {
                        return response.json()
                    }).then(data => {
                        if (data) {
                            let value = data.value
                            console.log(value);
                            if (value == 0) {
                                setTimeout(() => {
                                    location.href = '/order-placed'
                                }, 1000);
                            } else {
                                Swal.fire('Order Placed!', 'sorry, failed to place the order !', 'error');
                            }
                        }
                    }).catch(error => {
                        console.log(error);
                    })

                }
            });
        }z
    })
});





document.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', () => {
        const orderId = select.getAttribute('data-id')
        const status = select.value

        fetch('/admin/change-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderId, status
            })

        }).then(response => {
            return response.json()
        }).then(data => {
            if (data) {

            }
        }).catch(error => {
            console.log(error);
        })

    })
})






















