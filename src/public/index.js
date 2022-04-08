
$(document).ready(function () {

    handleClickSelectBit();

    $('#crt-key').click(handleCreateKey)
    $('#Encode').click(handleEncode)
    $('#Decode').click(handleDecode)


    //Bỏ hiệu ứng lỗi khi input được nhập
    $('textarea#text-input').focus(function (e) {
        $(e.target).removeClass('error')
        $('.text-error').removeClass('show')
    })
})

function handleClickSelectBit() {
    const bitSelecteds = $('.m-bit')
    $.each(bitSelecteds, function (index, element) {
        $(element).click(function (e) {
            bitSelecteds.removeClass('active')
            $(element).addClass('active')
        });
    });
}   


function handleCreateKey() {

    //Clear input và output khi tạo cặp key mới
    $("#text-output").val('')
    $("#text-input").val('')
    $('textarea#text-input').removeClass('error')
    $('.text-error').removeClass('show')

    const bit = $('.m-bit.active').text()
    console.log(bit)
    //call api lấy đc cặp key
    const data = { "modulusLength": bit }
    console.log(data)

    fetch('/api/crypto/generateKey', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(respon => {
        $('.public').text(respon.publicKey)
        $('.private').text(respon.privateKey)
    })



}

function handleEncode() {
    const publicK = $('.public').text()
    //Nếu đã có public key => tiến hành encode
    if (publicK.trim() !== "") {
        const inputText = $("#text-input").val().trim()
        if (inputText == "") {
            $('textarea#text-input').addClass('error')
            alert("Vui lòng nhập dữ liệu để mã hóa !")
        } else {
            const option = { publicKey: publicK, data: inputText }
            //post api mã hóa
            fetch('/api/crypto/encode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(option),
            })
            .then(response => {
                if(response.status == 400) {
                    $('textarea#text-input').addClass('error')
                    $('.text-error').addClass('show')
                }
                    return response.json()
            })
            .then(respon => {
                $('.text-error').text(respon.errorMsg || "")
                $("#text-output").val(!respon.errorMsg ? respon.encryptedDataStr : "")
            })
            .catch(error => {
                console.log(error)
            })
            
        }

    } else {
        //Nếu chưa tạo public key => thông báo người dùng tạo key
        alert("Bạn chưa tạo key. Vui lòng click \"Create Key\"")
    }
}

function handleDecode() {
    const privateK = $('.private').text()
    if (privateK.trim() !== "") {
        const inputText = $("#text-input").val().trim()
        if (inputText == "") {
            $('textarea#text-input').addClass('error')
            alert("Vui lòng nhập dữ liệu để giải mã !")
        } else {
            console.log($("#text-input").val().trim())
            const option = { privateKey: privateK, encryptedData: $("#text-input").val().trim() }
            //post api mã hóa
            fetch('/api/crypto/decode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(option),
            })
            .then(response => {
                if(response.status == 400) {
                    $('textarea#text-input').addClass('error')
                    $('.text-error').addClass('show')
                }
                
                return response.json()
            })
            .then(respon => {
                console.log(respon)
                $('.text-error').text(respon.errorMsg || "")
                $("#text-output").val(!respon.errorMsg ? respon : "")
            })
            .catch(error => {
                console.log(error)
            })
        }
    } else {
        alert("Bạn chưa tạo key. Vui lòng click \"Create Key\"")
    }
}