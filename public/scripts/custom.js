
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



////////////////////////////////////////////////////////////////////////  ADD CATEGORY ///////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////// ADD CATEGORY  ///////////////////////////////////////////////////////////////

const addCategory = function () {
    let categoryname = document.getElementById('categoryName').value

    if (categoryname.trim() !== '') {
        let row = document.createElement('tr');

        row.innerHTML = `
        <td>
            <a>${categoryname}</a>
        </td>
        <td>
        <button type="button" data-product-id="<%=category[i].id%>"
                                                    class="list-unlist btn btn-danger " 
                                                    data-action="<%= category[i].is_listed ? 'unlisted' : 'Listed'%>">unlisted
                                                  </button>


                                                <a href="/admin/edit-category?id=<%=category[i].id%>">
                                                    <button data-id="<%=category[i].id%>" data-event="edit"
                                                        class="edit-delete btn btn-warning"
                                                        type="button">edit</button></a>
        </td>
    `;

        let tablebody = document.querySelector('.table tbody');
        document.getElementById('categoryName').value = ''

        fetch('/admin/add-category', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                categoryname: categoryname
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data) {
                let value = data.value
                if (value == 0) {
                    Swal.fire(`${data.message}`);
                } else {
                    location.reload()
                    tablebody.appendChild(row);
                }
            }
        }).catch(error => {
            console.log(error);
        })

    } else if (categoryname.includes(' ')) {
        Swal.fire('cannnot include space')
    } else if (categoryname.length < 0) {
        Swal.fire('please enter a name to add category')
    }

}



//////////////////////////////////////////////////////////////////////// UNLIST AND LIST CATEGORY  ///////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////// UNLIST AND LIST CATEGORY  ///////////////////////////////////////////////////////////////


document.querySelectorAll('.list-unlist').forEach(button => {
    button.addEventListener('click', async () => {
        const event = button.getAttribute('data-action')
        const id = button.getAttribute('data-product-id')
        let url
        if (event == 'Listed') {
            url = '/admin/unlist-category'
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You need to unlist this category",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, unList"
            });

            if (!result.isConfirmed) {
                console.log('should be canceled');
                return; // Cancel the operation if not confirmed
            }

            Swal.fire({
                title: "unListed!",
                text: "category has been unlisted",
                icon: "success"
            });


        } else {
            url = '/admin/list-category'
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You need to list this category",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, List"
            });

            if (!result.isConfirmed) {
                console.log('should be canceled');
                return; // Cancel the operation if not confirmed
            }

            Swal.fire({
                title: "Listed!",
                text: "category has been listed",
                icon: "success"
            });
        }
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data) {
                button.innerHTML = event === 'Listed' ? 'unlisted' : 'listed';
                button.setAttribute('data-action', event === 'Listed' ? 'unlisted' : 'listed');
                newEvent = button.innerHTML
                button.classList.toggle('btn-danger', newEvent === 'unlisted');
                button.classList.toggle('btn-success', newEvent === 'listed');
            }
        }).catch(error => {
            console.log(error);
        })
    })
})





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


container.addEventListener('mousemove',move)
container.addEventListener('mouseout',remove)
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

function addtocart(productId){
    fetch('/product-cart',{
        method : 'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body :  JSON.stringify({
            productId
        })
    }).then(response=>{
        return response.json()
    }).then(data=>{
        if(data){
            console.log('heeyy');
            Swal.fire({
                position: "center", 
                icon: "success",
                title: "product added to cart",
                showConfirmButton: false,
                timer: 1500
              });  
        }
    }).catch(error=>{
        console.log(error);
    })
}