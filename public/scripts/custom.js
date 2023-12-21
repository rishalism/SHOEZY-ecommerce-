





//////////////////////////////////////////////////////////////////////// BLOCK AND UNBLOCK USER  ///////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////// BLOCK AND UNBLOCK USER  ///////////////////////////////////////////////////////////////


document.querySelectorAll('.block-button').forEach((button) => {
    button.addEventListener('click', async () => {
        const userId = button.getAttribute('data-user-id');
        let currentState = button.getAttribute('data-state');
        console.log(userId, currentState);
        let url;

        if (currentState === 'Blocked') {
            url = '/admin/block-user';
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You need to block this user",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Block"
            });

            if (!result.isConfirmed) {
                console.log('should be canceled');
                return; // Cancel the operation if not confirmed
            }

        } else {
            url = '/admin/unblock-user';
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You need to unblock this user",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, unBlock"
            });

            if (!result.isConfirmed) {
                console.log('should be canceled');
                return; // Cancel the operation if not confirmed
            }

            Swal.fire({
                title: "Blocked!",
                text: "User has been blocked",
                icon: "success"
            });
        }

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userID: userId
                })
            });

            const data = await response.json();

            if (data) {
                console.log(data);

                // Common logic for both states
                button.innerHTML = currentState === 'Blocked' ? 'Unblock' : 'Block';
                button.setAttribute('data-state', currentState === 'Blocked' ? 'UnBlocked' : 'Blocked');
                if (currentState === 'Blocked') {
                    button.classList.remove('btn-danger');
                    button.classList.add('btn-success');
                } else {
                    button.classList.remove('btn-success');
                    button.classList.add('btn-danger');
                }
                Swal.fire("Success", `User has been ${currentState === 'Blocked' ? 'blocked' : 'unblocked'}`, "success");
            }
        } catch (error) {
            console.error(error);
        }
    });
});








//////////////////////////////////////////////////////////////////////// UNLIST AND LIST PRODUCT  ///////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////// UNLIST AND LIST PRODUCT  ///////////////////////////////////////////////////////////////



function openCustomModal() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('customModal').style.display = 'block';

}


function closeCustomModal() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('customModal').style.display = 'none';
}


let productid = 0
let action = 0
document.querySelectorAll('.unlisted').forEach(button => {
    button.addEventListener('click', () => {
        productid = button.getAttribute('data-product-id')
        action = button.getAttribute('data-action');
        if (action == 'unlisted') {
            fetch('/admin/list-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productid
                })

            }).then(response => {
                return response.json()
            }).then(data => {
                if (data) {
                    button.setAttribute('data-action', 'Listed');
                    button.classList.remove('btn-danger');
                    button.classList.add('btn-success');
                    button.innerText = 'Listed';
                }
            }).catch(error => {
                console.log(error);
            })
        } else {
            openCustomModal();

        }
        console.log(productid, action);
    })
})



document.querySelectorAll('.data-id button').forEach(button => {
    button.addEventListener('click', () => {
        const event = button.getAttribute('data-event');
        console.log(event, productid);

        if (action == 'Listed') {
            if (event == 'yes') {
                fetch('/admin/unlist-product', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productid
                    })
                }).then(response => {

                    return response.json()
                }).then(data => {
                    if (data) {
                        closeCustomModal();
                        location.reload()
                    }
                }).catch(error => {
                    console.log(error);
                })
            } else {
                closeCustomModal();
            }

        }

    });
});




//////////////////////////////////////////////////////////////////////// zooming effect  ///////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////// zoomig effect  ///////////////////////////////////////////////////////////////


const container = document.querySelector('.image-div')
const image = document.querySelector('.image-div img')
const lens = document.querySelector('.lens');
const zoom = document.querySelector('.zoom');



container.addEventListener('mousemove', move)
container.addEventListener('mouseout', remove)
function move(e) {
    const container_rect = container.getBoundingClientRect();

    let x = e.pageX - container_rect.left - lens.offsetWidth / 2;
    let y = e.pageY - container_rect.top - lens.offsetHeight / 2;
    let maxX = container_rect.width - lens.offsetWidth;
    let maxY = container_rect.height - lens.offsetHeight;
    if (x > maxX) x = maxX
    if (x < 0) x = 0

    if (y > maxY) y = maxY
    if (y < 0) y = 0

    lens.style.cssText = `top: ${y}px; left: ${x}px;`
    let cx = container_rect.width / lens.offsetWidth;
    let cy = container_rect.height / lens.offsetHeight;
    zoom.style.cssText = `
    background: url(${image.src}) -${x * cx}px -${y * cy}px /
    ${container_rect.width * cx}px ${container_rect.height * cy}px
    no-repeat;
    `
    lens.classList.add('active');
    zoom.classList.add('zoom-active')
}

function remove() {
    lens.classList.remove('active')
    zoom.classList.remove('zoom-active')

}

function changeImage(item) {
    image.src = item.src;
}






//////////////////////////////////////////////////////////////////////// add to cart   ///////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////// add to cart   ///////////////////////////////////////////////////////////////

function addtocart(productId, prize) {
    fetch('/product-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productId,
            prize
        })
    }).then(response => {
        return response.json()
    }).then(data => {
        if (data) {
            let value = data.value
            if (value == 1) {
                Swal.fire({
                    text: "Products already exist in the cart",
                    showClass: {
                        popup: `
                            animate__animated
                            animate__fadeInUp
                            animate__slower
                        `,
                    },
                    hideClass: {
                        popup: `
                            animate__animated
                            animate__fadeOutDown
                            animate__slower
                        `,
                    },
                });

            } else if (value == 2) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        // toast.onmouseenter = Swal.stopTimer;
                        // toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                Toast.fire({
                    icon: "success",
                    title: " added to cart!"
                });

            } else {
                Swal.fire({
                    icon: "error",
                    text: "Please log in to your account to add items to your cart",
                    showCancelButton: true,
                    allowOutsideClick: false,
                    confirmButtonText: 'Login',
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Redirect to the login page
                        window.location.href = "/login";
                    }
                });

            }

        }
    }).catch(error => {
        console.log(error);
    })
}


///////////////////////////////////////////////////////////// remove product from the cart ///////////////////////////////////////////////////////
function removeproduct(productID, tableRow) {
    console.log(tableRow);
    Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove !"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('/remove-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productID
                })
            }).then(response => {
                return response.json();
            }).then(data => {
                if (data) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Item has been removed.",
                        icon: "success"
                    }).then(() => {
                        // Remove the row from the table
                        tableRow.remove();
                    });
                }
            }).catch(error => {
                console.log(error);
            });
        }
        // If the user clicks cancel, no action is taken
    });
}


////////////////////////////////////////////////////////////////////////////////////////check user session////////////////////////////////////////////////////////////
function checkUserSession() {
    fetch('/check-cart', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.json()
    }).then(data => {
        if (data) {
            let value = data.value
            console.log(value);
            if (value == 1) {
                window.location.href = "/product-cart";
            } else {
                Swal.fire({
                    icon: "error",
                    text: "Please log in to view the cart.",
                    showCancelButton: true,
                    allowOutsideClick: false,
                    confirmButtonText: 'Login',
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Redirect to the login page
                        window.location.href = "/login";
                    }
                });
            }
        }
    }).catch(error => {
        console.log(error);
    })

}

///////////////////////////////////////////////////update quantity/////////////////////////////////////////////////////////////////////////////



function updateTotal(productId, quantity, prize) {
    var totalElement = document.getElementById(`total_${productId}`);
    var subejs = document.getElementById('subtotal');
    var total = quantity * prize;
    totalElement.textContent = "₹" + total;

    return total
}





async function increase(prize, productId, stock) {
    var quantityValue = document.getElementById(`quantityValue_${productId}`);
    var currentQuantity = parseInt(quantityValue.textContent);
    if (currentQuantity < stock) {
        quantityValue.textContent = currentQuantity + 1;
        var total = updateTotal(productId, currentQuantity + 1, parseFloat(prize));

        try {
            const response = await fetch('/quantity-updation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId,
                    total,
                    currentQuantity
                })
            });

            const data = await response.json();
            if (data) {
                console.log(stock);
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        Swal.fire('Reached maximum quantity for this product!');
    }
}




async function decrease(prize, productId) {
    var quantityValue = document.getElementById(`quantityValue_${productId}`);
    var currentQuantity = parseInt(quantityValue.textContent);

    if (currentQuantity > 1) {
        quantityValue.textContent = currentQuantity - 1;
        var total = updateTotal(productId, currentQuantity - 1, parseFloat(prize));


        try {
            const response = await fetch('/quantity-decrement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId,
                    total,
                    currentQuantity
                })
            });

            const data = await response.json();
            if (data) {
                console.log('ok');
            }
        } catch (error) {
            console.log(error);
        }

    } else {
        Swal.fire('Reached minimum quantity for this product!');
    }
}



function update() {
    location.reload()
}



/////////////////////////////////////////////////////////////////modal for adding address /////////////////////////////////////////////////////



async function openModal() {

    var country
    var zip
    var state
    var city
    var apartment
    var streetAddress

    const { value: formValues } = await Swal.fire({
        title: "shipping address",
        html: `
        
        <div class="card">
    <div class="card-body">
    <form action="/admin/user-account" method= "post">
        <div class="form-group">
            <input type="text" name="address" class="form-control" id="Address" placeholder="Enter street address" required>
        </div>
        <div class="form-group">
            <input type="text" name="apartment" class="form-control" id="apartments" placeholder="Enter house name or apartment">
        </div>
        <div class="form-row">
            <div class="form-group col-md-6">
                <input type="text" name="city" class="form-control" id="town" placeholder="Enter city" required>
            </div>
            <div class="form-group col-md-6">
                <input type="text" name="State" class="form-control" id="State" placeholder="Enter state" required>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col-md-6">
                <input type="number" minlength="1" maxlength="6" class="form-control" name="zip" id="zipcode" placeholder="Enter zip code" required>
            </div>
            <div class="form-group col-md-6">
                <input type="text" class="form-control" id="countries" name="countries" placeholder="Enter country" required>
            </div>
        </div>
        <form>
    </div>
</div>

        `,
        focusConfirm: false,
        allowOutsideClick: false,
        showCancelButton: true,
        preConfirm: () => {
            streetAddress = document.getElementById("Address").value
            apartment = document.getElementById("apartments").value
            city = document.getElementById("town").value
            state = document.getElementById("State").value;
            zip = document.getElementById("zipcode").value
            country = document.getElementById("countries").value


            if (!streetAddress || !apartment || !city || !state || !zip || !country) {
                Swal.showValidationMessage('All fields are required');
                return false;
            }
        }
    });

    console.log(streetAddress, apartment, city, state, zip, country);
    fetch('/user-account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            streetAddress, city, zip, state, apartment, country
        })
    }).then(response => {
        return response.json()
    }).then(data => {
        if (data) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "shipping address has been saved",
                showConfirmButton: false,
            }); setTimeout(() => {
                location.reload()
            }, 1000);
        }
    }).catch(error => {
        console.log(error);
    })

}










