let CONTRACT_ADDRESS = "TBhgLbU2qhg2GcnuzteKuD9GK7uiTEQtPk";
let CONTRACT_ADDRESS_2 = "TVxGy1RJrixzy9WUB1anFiZ9iLfyAHDz8D";
let STATISTIC = "https://dappcall.com:4141/statistic";
let TOTAL_INVEST = "https://dappcall.com:4141/total_invest";
let nodeUrl = "https://api.trongrid.io";
let currentAccount;
let dividents = [4, 16, 62, 220, 680, 1400];
let factory_types = ['rise', 'phen', 'orange', 'tea', 'vino', 'koki'];
let factory_prices = [3000, 11750, 44500, 155000, 470000, 950000];
let user_balance = 0;
let coinsForBuy = 0;
let coinsForSell = 0;
let html_coin = ' <i><img src="../img/icon/ico_money.png" alt=""></i>';

let tronWebJS = new TronWebJS(
    new TronWebJS.providers.HttpProvider(nodeUrl),
    new TronWebJS.providers.HttpProvider(nodeUrl),
    nodeUrl,
);

updateData();
setInterval(function(){
    updateData();
}, 5000);

function updateData(){
    tronWebJS.trx.getBalance(CONTRACT_ADDRESS).then(balance => {
        balance = Math.floor(balance / Math.pow(10, 6));
           /*

       $.get(TOTAL_INVEST, function(withdraw) {
            $('#balance').html(format_number(parseFloat(balance+withdraw.total).toFixed(0)) + ' TRX');
        }).fail(function() {
            $('#balance').html(format_number(balance) + ' TRX');    
        });; */

    });
    
    tronWebJS.contract().at(CONTRACT_ADDRESS).then(contract => {
        contract.methods.totalPlayers().call().then(totalPlayers => {
            totalPlayers = tronWebJS.toDecimal(totalPlayers);
            $('#totalPlayers').html(format_number(totalPlayers));
        });
    
        contract.methods.totalPlantation().call().then(totalPlantation => {
            totalPlantation = tronWebJS.toDecimal(totalPlantation);
            $('#totalPlantation').html(format_number(totalPlantation));
        });
    
        contract.methods.totalPayout().call().then(totalPayout => {
            totalPayout = Math.floor(tronWebJS.toDecimal(totalPayout) / Math.pow(10, 6));
            $('#totalPayout').html(format_number(totalPayout) + ' TRX');
        });
    
        /* User data */
        $(document).ready(function(){
            var tronWeb = window.tronWeb;
            if(tronWeb && tronWeb.defaultAddress.base58){
                currentAccount = tronWeb.defaultAddress.base58;
                $('#currentAccount').html(currentAccount);
                $('#currentAccount').parent().attr('href', 'https://tronscan.org/#/address/'+currentAccount);
                  
                contract.methods.players(currentAccount).call().then(player_info => {
                    coinsForBuy = tronWeb.toDecimal(player_info.coinsForBuy);
                    coinsForSell = tronWeb.toDecimal(player_info.coinsForSale);
                    // $('#user_coinsForBuy').html(format_number(coinsForBuy) + html_coin);
                    // $('#user_coinsForSell').html(format_number(coinsForSell) + html_coin);
                });
                
                contract.methods.plantationOf(currentAccount).call().then(player_factories => {
                    let user_factories_count = 0;
                    let user_dividents_count = 0;
                    for(let i = 0; i < player_factories.length; i++){
                        let count = tronWeb.toDecimal(player_factories[i]);
                        let divs  = tronWeb.toDecimal(player_factories[i]) * dividents[i];
                        user_factories_count += count;
                        user_dividents_count += divs;
                        
                        $('#factory_count_'+i).html(format_number(count) + ' ' + $('#factory_count_'+i).html().split(' ')[1] );
                        $('#factory_divident_'+i).html(format_number(divs));
                    }
                    $('#user_factories').html(format_number(user_factories_count));
                    $('#user_dividents').html(format_number(user_dividents_count) + html_coin);
                });
                
                tronWeb.trx.getBalance(currentAccount).then(balance => {
                    user_balance = Math.floor(balance / Math.pow(10, 6));
                    $('#user_balance').html(user_balance);
                    
                });
                
                tronWebJS.contract().at(CONTRACT_ADDRESS_2).then(contract => {
                    contract.methods.coinsOf(currentAccount).call().then(stat => {
                        coinsForBuy = tronWebJS.toDecimal(stat.treasury);
                        coinsForSell = tronWebJS.toDecimal(stat.spare);
                        $('#user_coinsForBuy').html(format_number(coinsForBuy) + html_coin);
                        $('#user_coinsForSell').html(format_number(coinsForSell) + html_coin);
                    });
                });
            }
        });
    });
}

$('[name=button_plant]').on('click', function(){
    if(!window.tronWeb || !window.tronWeb.defaultAddress.base58){
        $('#no_tronweb').show();
    } else {
        $('[name=plant_user_balance]').html(format_number(coinsForBuy+coinsForSell));
        
        let id = this.id.split('factory_button_')[1];
        let price = $('#plant_input_'+id).val() * factory_prices[id];
        
        if(coinsForBuy+coinsForSell < price){
            $('#plant_button_'+id).hide();
            $('#plant_error_field_'+id).show();
        } else {
            $('#plant_button_'+id).show();
            $('#plant_error_field_'+id).hide();
        }
        
        $('#'+factory_types[id]).show();
    }
});

$('#button_popol').on('click', function(){
    if(!window.tronWeb || !window.tronWeb.defaultAddress.base58){
        $('#no_tronweb').show();
    } else {
        window.tronWeb.trx.getBalance(currentAccount).then(balance => {
            user_balance = Math.floor(balance / Math.pow(10, 6));
            $('#user_balance').html(user_balance);
            
            if(user_balance < $('#input_buy').val()){
                $('#button_buy').hide();
                $('#buy_error_field').show();
            } else {
                $('#button_buy').show();
                $('#buy_error_field').hide();
            }
        });
        
        $('#popol').show();
    }
});

$('#button_vivod').on('click', function(){
    if(!window.tronWeb || !window.tronWeb.defaultAddress.base58){
        $('#no_tronweb').show();
    } else {
        $('#vivod_balance').html(coinsForSell);
        
        if(coinsForSell < $('#input_withdraw').val()){
            $('#button_withdraw').hide();
            $('#withdraw_error_field').show();
        } else {
            $('#button_withdraw').show();
            $('#withdraw_error_field').hide();
        }
        
        $('#vivod').show();
    }
});

$('#auth_ok').on('click', function(){
    $('#no_tronweb').hide();
});

$('.value_inp').on('input', function (event) { 
    this.value = this.value.replace(/[^0-9]/g, '');
    if(this.value == "")
        this.value = 0;
    this.value = parseInt(this.value, 10);
});

$('#input_buy').on('input', function (event) { 
    $('#button_buy > span').html(this.value * 25);
    if(this.value == 0 || user_balance < this.value){
        $('#button_buy').hide();
    } else {
        $('#button_buy').show();
    }
    
    if(user_balance < this.value){
        $('#buy_error_field').show();
    } else {
        $('#buy_error_field').hide();
    }
});

$('#input_withdraw').on('input', function (event) { 
    $('#button_withdraw > span').html(this.value/25);
    if(this.value == 0 || coinsForSell < this.value){
        $('#button_withdraw').hide();
    } else {
        $('#button_withdraw').show();
    }
    
    if(coinsForSell < this.value){
        $('#withdraw_error_field').show();
    } else {
        $('#withdraw_error_field').hide();
    }
});

$('[name=plant_input]').on('input', function(){
    let id = this.id.split('plant_input_')[1];
    let price = this.value * factory_prices[id];
    $('#plant_button_'+id+' > span').html(format_number(price));
    if(this.value == 0 || coinsForBuy+coinsForSell < price){
        $('#plant_button_'+id).hide();
    } else {
        $('#plant_button_'+id).show();
    }
    
    if(coinsForBuy+coinsForSell < price){
        $('#plant_error_field_'+id).show();
    } else {
        $('#plant_error_field_'+id).hide();
    }
});

$('#button_buy').on('click', function(){
    window.tronWeb.contract().at(CONTRACT_ADDRESS).then(contract => {
        contract.methods.deposit().send({'callValue': $('#input_buy').val() * Math.pow(10, 6)}, function(data){
            console.log(data);
            $('#popol').hide();
        });
    });
});

$('#button_withdraw').on('click', function(){
    window.tronWeb.contract().at(CONTRACT_ADDRESS).then(contract => {
        contract.methods.withdraw($('#input_withdraw').val()).send(function(data){
            console.log(data);
            $('#vivod').hide();
        });
    });
});

$('[name=button_plant_tron]').on('click', function(){
    let id = this.id.split('plant_button_')[1];
    let number = $('#plant_input_'+id).val();
    window.tronWeb.contract().at(CONTRACT_ADDRESS).then(contract => {
        contract.methods.buy(id, number).send(function(data){
            console.log(data);
            $('#'+factory_types[id]).hide();
        });
    });
});

$('#button_top').on('click', function(){
    $.getJSON(STATISTIC, function(data) {
        let users = data['users'];
        let sort_users = users.sort(function(a,b){ 
            return b.dividents - a.dividents   
        });
        
        let top_liders = $('#table_liders_top').html().split('</tr>')[0] + '</tr>';
        let liders     = $('#table_liders').html().split('</tr>')[0] + '</tr>';
        for(let i = 0; i < sort_users.length; i++){
            if(i < 100){
                if(i < 3){
                    top_liders +=   '<tr>'+
                                    '   <td class="text-center">'+
                                    '       <img src="../img/t'+(i+1)+'.png" alt="">'+
                                    '   </td>'+
                                    '   <td class="text-center">'+
                                    '       <a target="_blank" href="https://tronscan.org/#/address/'+sort_users[i].address+'">'+sort_users[i].address.substring(0,15)+'...</a>'+
                                    '   </td>'+
                                    '   <td class="text-right">'+
                                    '       '+format_number(sort_users[i].dividents)+' <i><img src="../img/icon/ico_money.png" alt=""></i>'+
                                    '   </td>'+
                                    '</tr>';   
                } else {
                    liders +=       '<tr>'+
                                    '   <td class="text-center">'+
                                    '       <span class="num_top">'+
                                    '           '+(i+1)+
                                    '       </span>'+
                                    '   </td>'+
                                    '   <td class="text-center">'+
                                    '       <a target="_blank" href="https://tronscan.org/#/address/'+sort_users[i].address+'">'+sort_users[i].address.substring(0,15)+'...</a>'+
                                    '   </td>'+
                                    '   <td class="text-right">'+
                                    '       '+format_number(sort_users[i].dividents)+' <i><img src="../img/icon/ico_money.png" alt=""></i>'+
                                    '   </td>'+
                                    '</tr>';
                }
            }
            if(sort_users[i].address == currentAccount){
                $('#user_top_place').html((i+1));   
            }
        }
        $('#table_liders_top').html(top_liders);
        $('#table_liders').html(liders);
    });

    $('#top').show();
});

$('#button_transfers').on('click', function(){
    $.get(STATISTIC, function(data) {
        if(data.txs[currentAccount] != undefined){
            let transfers_popol_sum = 0;
            let transfers_vivod_sum = 0;
            let history_table_head = $('#history_table').html().split('</tr>')[0] + '</tr>';
            let history_table = '';
            for(let i = 0; i < data.txs[currentAccount].length; i++){
                if(data.txs[currentAccount][i]['call_value'] == undefined){
                    data.txs[currentAccount][i]['call_value'] = 0;
                }
                
                if(data.txs[currentAccount][i]['method'] == 'buy'){
                    continue;
                }
                let withdraw_style = "";
                let amount = 0;
                if(data.txs[currentAccount][i]['method'] == 'deposit'){
                    if(data.txs[currentAccount][i]['call_value'] != undefined){
                        transfers_popol_sum += data.txs[currentAccount][i]['call_value'];
                    }
                    amount = Math.floor(data.txs[currentAccount][i]['call_value'] / Math.pow(10, 6));
                }
                if(data.txs[currentAccount][i]['method'] == 'withdraw'){
                    if(data.txs[currentAccount][i]['call_value'] != undefined){
                        transfers_vivod_sum += data.txs[currentAccount][i]['call_value'];
                    }
                    withdraw_style = 'style="color: #32CD32;"';
                    amount = Math.floor(data.txs[currentAccount][i]['call_value']);
                }
                
                let less0part = Math.floor(data.txs[currentAccount][i]['call_value'] * 100) % 100;
                if(less0part < 10) less0part = ''+0+less0part;
                history_table = '<tr>'+
                                '   <td class="text-left">'+getDateTime(data.txs[currentAccount][i]['timestamp'])+'</td>'+
                                '   <td>'+
                                '       <a target="_blank" href="https://tronscan.org/#/transaction/'+data.txs[currentAccount][i]['txid']+'">'+data.txs[currentAccount][i]['txid'].substring(0,15)+'...</a>'+
                                '   </td>'+
                                '   <td class="text-right" '+withdraw_style+'>'+format_number(amount)+','+less0part+' TRX</td>'+
                                '</tr>' + history_table;
            }
            
            $('#history_table').html(history_table_head + history_table);
            
            let less0part = (transfers_popol_sum / Math.pow(10, 6) * 100) % 100;
            if(less0part < 10) less0part = ''+0+less0part
            $('#transfers_popol_sum').html(format_number(Math.floor(transfers_popol_sum / Math.pow(10, 6))) + ',' + less0part + ' TRX');
            
            less0part = Math.floor(transfers_vivod_sum * 100) % 100;
            if(less0part < 10) less0part = ''+0+less0part;
            $('#transfers_vivod_sum').html(format_number(Math.floor(transfers_vivod_sum)) + ',' + less0part + ' TRX');
        }
    });
    $('#history').show();
});

function format_number(number){
    if(number == undefined)
        number = 0;
    let str_number_last_pos = number.toString().length - 1;
    let result = "";
    for(let i = str_number_last_pos; i >= 0; i--){
        if((str_number_last_pos - i) % 3 == 0 && i != str_number_last_pos)
            result = "," + result;
        result = number.toString()[i] + result;
    }
    return result;
}

function getDateTime(datetime) {
    var date = new Date();
    if(datetime != undefined)
        date = new Date(datetime);
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
}