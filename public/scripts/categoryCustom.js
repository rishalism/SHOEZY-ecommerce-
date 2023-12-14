//////////////////////////////////////////////////////////////////////// UNLIST AND LIST CATEGORY  ///////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////// UNLIST AND LIST CATEGORY  ///////////////////////////////////////////////////////////////


document.querySelectorAll('.list-unlist').forEach(button => {
    button.addEventListener('click', async () => {
        console.log('working');
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




///////////////////////////////////////////////////////////////////////////////////edit category //////////////////////////////////////////



document.getElementById('edit-cat').addEventListener('click', () => {
    console.log('working');

    const id = document.getElementById('catid').value
    const categoryName = document.getElementById('categoryName').value

    fetch('/admin/edit-category', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id, categoryName
        })

    }).then(response => {
        return response.json()
    }).then(data => {
        if (data) {
            let value = data.value

            if (value == 1) {
                Swal.fire(`${categoryName} already exists`);
            } else if (value == 0) {
                location.href = '/admin/categories'
            }
        }
    }).catch(error => {
        console.log(error);
    })
})

////////////////////////////////////////////////////////// delete product on edit product //////////////////////////////////////////////


function deleteImage() {

    const activeItem = $('#imageCarousel .carousel-item.active');

    // Get the image name from the data-id attribute of the currently active item
    const imageName = activeItem.find('img').data('id');
    const b = document.getElementById('image-delete');
    const productID = b.getAttribute('data-productID')
 console.log(productID);
    Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove !"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('/admin/edit-delete-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    imageName, productID
                })
            }).then(response => {
                return response.json()
            }).then(data=>{
                if(data){
                    Swal.fire({
                        title: "remove!",
                        text: "image has been removed",
                        icon: "success"
                    });                }
            }).catch(error=>{
                console.log(error);
            })

        }
    });


}
