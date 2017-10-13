/**
 * Volodymyr Kuchma test work
 */

$(function() {
    //orders array
    var orders = {};
    var editing = false;
    var curID = '';

    // if empty lS (first entry) download some orders fron JSON
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify(orders) );
        $.ajax({
            'async': false,
            'global': false,
            'url': "orders.json",
            'dataType': "json",
            'success': function (data) {
                localStorage.setItem('orders', JSON.stringify(data));
            },
            'error': function () {

                //have to be run on server for Ajax JSON import, array here as an alternative
                var ordersFirst = {"1709231":{"id":"o-1709231","date":"09.09.17","email":"email@youcompany.com","name":"Татьяна Васильевна","lastname":"Белоус","tel":"066 22 11 333","pos":"ручки, фломастеры","type":"o","seller":"Roga&Kopyta","dateTo":"2017-09-19","comment":"","status":0},"1709232":{"id":"p-1709232","date":"15.09.17","email":"email2@company.com","name":"Иван Иванович","lastname":"Иванов","tel":"066 22 11 1111","pos":"сало","type":"p","seller":"Мясосало","dateTo":"2017-09-22","comment":"сало)","status":3},"1709233":{"id":"o-1709233","date":"18.09.17","email":"mail@company3.com","name":"Петр Петрович","lastname":"Петренко","tel":"066 2277777","pos":"торты","type":"o","seller":"Чокаладке","dateTo":"2017-09-22","comment":"","status":1},"1709234":{"id":"p-1709234","date":"23.09.17","email":"e1mail@you1company.com","name":"Василиса Васильевна","lastname":"Васюк","tel":"097 9797979","pos":"девайсы","type":"p","seller":"ГуглПродСнаб","dateTo":"2017-09-30","comment":"","status":0}};
                localStorage.setItem('orders', JSON.stringify(ordersFirst) );
            }
        });
    }

    orders = JSON.parse(localStorage.getItem('orders'));

    //some time vars
    var today = new Date();
    var timeInMs = Date.now();
    var dd = today.getDate();
    var mm =('0'+(today.getMonth()+1)).slice(-2);
    var yyyy = (''+today.getFullYear()).slice(-2);
    var monthOrders = 0;// should come from backend
    getMonthAmount(mm);
    var nowDate = (dd + '.' + mm + '.' + yyyy);
    $('#date-input').val(today.getFullYear()+ '-'+ mm +'-' + dd);

    // order ID vars
    var orderID = getId();
    UpdateTitle(orderID,nowDate);
    setId();

    //show orders table
    out();

    // how much orders in this month
    function getMonthAmount(curMonth) {
        for (var key in orders) {
            var m = orders[key].date.substr(3, 2);
            if (m == curMonth) {
                monthOrders++;
            }
        }
    }

    //rewrite id prefix if change wholesale/retail
    $('#opt-input').on('change', function(){
        if (!editing) {
            orderID = getId();
        }
        else {
            orderID = $('#opt-input').val() + '-' + curID;
        }
        UpdateTitle(orderID,nowDate);
        setId()
    });

    function getId() {
        return $('#opt-input').val() + '-' + yyyy + mm + dd + (monthOrders + 1);
    }
    function setId() {
        $('#id-input').val(orderID);
    }
    function UpdateTitle(id,date) {
        $('#order-title').html('Заказ ' + id + ' от ' + date);
    }

    // sorting in table DataTable Library
    $('#orders-list').DataTable( {
    } );

    // change tab if click on button from home page
    $('#home a').click(function (e) {
        e.preventDefault();
        $('a[href="' + $(this).attr('href') + '"]').tab('show');
    });

    // ADD ORDER
    $('#add-order').on('click', function(e){
        e.preventDefault();
        var temp = {};
        temp.id = $('#id-input').val();
        temp.date = nowDate;
        temp.email = $('#email-input').val();
        temp.name = $('#name-input').val();
        temp.lastname = $('#lastname-input').val();
        temp.tel = $('#tel-input').val();
        temp.pos = $('#position-input').val();
        temp.type = $('#opt-input').val();
        temp.seller = $('#seller-input').val();
        temp.dateTo = $('#date-input').val();
        temp.comment = $('#comment-input').val();
        //temp.status = parseInt($('input[name=status]:checked').val());
        if ( $('#email-input').val() == "" || $('#name-input').val() == "" || $('#tel-input').val() == "" || $('#position-input').val() == ""){
            alert("Заполните необходимые поля!");
            return false;
        }
        if (!editing) {
            temp.status = 0;
            orders[orderID.substr(2)] = temp;
            monthOrders++;
        }
        else {
            temp.status = parseInt($('input[name=status]:checked').val());
            orders[curID] = temp;
            $('.nav-item a[href="#new-order"]').html('Новый заказ');
            editing = false;
        }
        out();
        orderID = getId();
        UpdateTitle(orderID,nowDate);
        setId();
        localStorage.setItem('orders', JSON.stringify(orders) );
        $('#add-item input').not(".filled").val('');
        $('#status-btns').addClass('invisible');
        $('a[href="' + $(this).attr('href') + '"]').tab('show');
    });

    // DRAW TABLE from LocalStorage
    function out() {
        var out = '';
        for (var key in orders) {
            var convTime = orders[key].dateTo.replace("-", ",");
            convTime = new Date(convTime).getTime();
            var editable = '';
            if (convTime - timeInMs > 259200000) {
                editable = 'class="editable"';
            }
            var status = orders[key].status;
            if (timeInMs - convTime > 86400000 && status === 0) {
                status = 2;
            }
            switch (status) {
                case 1:
                    status = 'btn-success">Done';
                    break;
                case 2:
                    status = 'btn-warning">Expired';
                    break;
                case 3:
                    status = 'btn-danger">Failed';
                    break;
                default:
                    status = 'btn-info">Confirmed';
            }
            var orderType = orders[key].type;
            if (orderType === 'o') {
                orderType = 'Опт'
            }
            else {
                orderType = 'Розница'
            }
            out += '<tr id="' + orders[key].id + '"' + editable
                + '><td>'
                + orders[key].date + '</td><td>Кучма В.О.</td><td>'
                + orders[key].id + '</td><td>'
                + orderType + '</td><td>'
                + orders[key].name + ' ' + orders[key].lastname + '</td><td>'
                + orders[key].seller + '</td><td>'
                + reformatDate(orders[key].dateTo) + '</td><td><button type="button" class="btn btn-sm btn-block ' +
                status +
                '</button></td></tr>';
        }
        $('#orders-list > tbody').html(out);
    }

    // EDIT ORDER
    $('#orders-list').delegate('.editable','click', function(){
        curID = $(this).attr('id').substr(2); // get id and cut "o-" or "p-"
        editing = true;
        UpdateTitle(orders[curID].id,orders[curID].date);
        $('#id-input').val(orders[curID].id);
        $('#email-input').val(orders[curID].email);
        $('#name-input').val(orders[curID].name);
        $('#lastname-input').val(orders[curID].lastname);
        $('#tel-input').val(orders[curID].tel);
        $('#position-input').val(orders[curID].pos);
        $('#opt-input').val(orders[curID].type);
        $('#seller-input').val(orders[curID].seller);
        $('#date-input').val(orders[curID].dateTo);
        $('#comment-input').val(orders[curID].comment);
        $('input[name=status]').eq(orders[curID].status).prop( "checked", true );
        $('.nav-item a[href="#new-order"]').html('Редактирование');
        $('#status-btns').toggleClass('invisible');
        $('a[href="#new-order"]').tab('show');
    });

});

function reformatDate(dateStr) {
    var dArr = dateStr.split("-");  // ex input "2010-01-18"
    return dArr[2]+ "." +dArr[1]+ "." +dArr[0].substring(2); //ex out: "18.01.10"
}


