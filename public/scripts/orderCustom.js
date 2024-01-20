


document.querySelectorAll('.place-order').forEach(button => {

    button.addEventListener('click', () => {
        let totalamount = document.getElementById('subtotal').value;
        const shippingID = button.getAttribute('data-addres');
        var discountElement = document.getElementById('discount');
        var spanElement = discountElement.querySelector('span');
        let status = document.getElementById('Wallet-Money').checked;
        let subtotal = spanElement.textContent
        var numericPart = subtotal.replace(/\D/g, '');
        subtotal = parseInt(numericPart);
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
        } else if (paymentMethod == 'cod' && status) {
            Swal.fire({
                text: "cannot use wallet money for cash on delivery !",
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
                            shippingID,paymentMethod,totalamount,subtotal,status
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
                            } else if (value == 1) {
                                let link = data.link
                                location.href = link
                            } else if (value == 2) {
                                Swal.fire({
                                    text: "We're sorry, but this product is currently out of stock. Please remove it from your cart or check back later. Thank you",
                                    icon: "error"
                                });
                            }
                        }
                    }).catch(error => {
                        console.log(error);
                    })

                    if (paymentMethod == 'netbanking') {
                        console.log('redirect');
                        let timerInterval;
                        Swal.fire({
                            title: "redirecting !",
                            html: "redirect to paypal in <b></b> milliseconds.",
                            timer: 2000,
                            timerProgressBar: true,
                            didOpen: () => {
                                Swal.showLoading();
                                const timer = Swal.getPopup().querySelector("b");
                                timerInterval = setInterval(() => {
                                    timer.textContent = `${Swal.getTimerLeft()}`;
                                }, 300);
                            },
                            willClose: () => {
                                clearInterval(timerInterval);
                            }
                        }).then((result) => {
                            /* Read more about handling dismissals below */
                            if (result.dismiss === Swal.DismissReason.timer) {
                                console.log("I was closed by the timer");
                            }
                        });
                    }

                }
            });
        }
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

document.getElementById('generateCoupon').addEventListener('click', () => {

    function generateRandomCoupon(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let coupon = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            coupon += characters.charAt(randomIndex);
        }

        return coupon;
    }

    const randomCoupon = generateRandomCoupon(8);

    document.getElementById('couponCode').value = randomCoupon

})