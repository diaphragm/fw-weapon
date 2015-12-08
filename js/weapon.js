
function clearModule(){
  $("#mod").find("input").prop("checked", false);
  $("#mod").find("label").removeClass("active")
}


function validateWeaponPow(){
  var pow = parseFloat( $("#weaponPow").val() );
  if( isNaN( pow ) || pow < 0 || pow != Math.floor( pow ) ){
    errorWeaponPow();
    return false;
  }else{
    clearErrors();
    return true;
  }
}

function errorWeaponPow(){
  $("#weaponPow").parent(".form-group").addClass("has-error");
  $("#errMes").removeClass("hidden");
}

function clearErrors(){
  var group = $("#weaponPow").parent(".form-group").removeClass("has-error");
  $("#errMes").addClass("hidden");
}



function calc(round){
  try{
    var selbox = $("#selWeapon");
    var adv = $("#advanced").prop("checked") ? 1 : 0 ;
    var weaponId = selbox.val();
    var name = weaponData[weaponId];
    var basePow = weaponData[weaponId][adv][0];
    var baseRate = weaponData[weaponId][adv][1];
    var pow = parseFloat( $("#weaponPow").val() );

    if( isNaN( pow ) || pow < 0 || pow != Math.floor( pow ) ){ return; }

    var level = parseInt($('input[name=selLv]:checked').val());
    var mod = 1;
    $("#mod").find("input:checked").each(function(){
      console.log(this.value);
      mod += parseFloat($(this).val());
    });
    mod = mod.toFixed(2);

    var floorBefore = weaponData[weaponId][2] ? true : false;
//    if( $("#round")[0].checked ) mod -= 1e-10;
    if(round) mod -= 1e-10;

    var o = $("#outt");
    o.empty();


//    var text = document.createTextNode( '武器名:' + name );
//    o.appendChild( text );
//    var br = document.createElement( 'br' );
//    o.appendChild( br );
//    text = document.createTextNode( '基礎値:' + basePow );
//    o.appendChild( text );
//    br = document.createElement( 'br' );
//    o.appendChild( br );
//    text = document.createTextNode( '基礎成長値:' + baseRate );
//    o.appendChild( text );
//    br = document.createElement( 'br' );
//    o.appendChild( br );
//    text = document.createTextNode( 'モジュラー倍率:' + mod );
//    o.appendChild( text );
//    br = document.createElement( 'br' );
//    o.appendChild( br );
//    if( mod != 1 ){
//      var span = document.createElement( 'span' );
//      span.style.color = 'red';
//      text = document.createTextNode( '※かっこ内の数値はモジュラーなし(倍率1.00)の時の値です' );
//      span.appendChild( text );
//      o.appendChild( span );
//      br = document.createElement( 'br' );
//      o.appendChild( br );
//    }
//    br = document.createElement( 'br' );
//    o.appendChild( br );
//    text = document.createTextNode( '候補' );
//    o.appendChild( text );
//    br = document.createElement( 'br' );
//    o.appendChild( br );

    var thead = $("<thead>");
    var head = $("#table-template").find("#head").clone();
    $(head.children("th")[level+1]).addClass("success");
    thead.append(head);

    var tbody = $("<tbody>");
    var noTR = true;
    for( var type in growthType ){
      var max = 20, min = 0;

      //narrow the range by solve inequality
      var g = Math.floor( 100 * ( ( basePow * 1000 + ( baseRate * 10 ) * ( growthType[type][level-1] * 100 ) ) * ( mod * 100 ) - pow * 100000 ) / ( ( baseRate * 10 ) * ( growthType[type][level-1] * 100 ) * ( mod * 100 ) ) );
      var s = Math.ceil( 100 * ( ( basePow * 1000 + ( baseRate * 10 ) * ( growthType[type][level-1] * 100 ) - ( floorBefore ? 1000 : 0 ) ) * ( mod * 100 ) - 100000 - pow * 100000 ) / ( ( baseRate * 10 ) * ( growthType[type][level-1] * 100 ) * ( mod * 100 ) ) );
      if( g < min || s > max ) continue;
      if( g < max ) max = g;
      if( s > min ) min = s;


      //solve by linear search
      for( var r = min; r <= max; ++r ){
        var calcPow = Math.floor( ( mod * 100 ) * ( floorBefore ? Math.floor( basePow + ( baseRate * 10 ) * ( growthType[type][level-1] * 100 ) * ( 100 - r ) / 100000 ) : ( basePow + ( baseRate * 10 ) * ( growthType[type][level-1] * 100 ) * ( 100 - r ) / 100000 ) ) / 100 );
        if( calcPow < pow ) break;
        if( calcPow > pow ) continue;
        var num = new Number( ( 100 - r ) / 100 );
        var row = $("#table-template").find("#" + type).clone();
        var td = $(row.find("td")[1]);
        var val = td.text().replace("{val}", String(num.toFixed(2))).replace("{rank}", String(r+1))
        td.text(val);
        for( var i = 0 ; i < 10; ++i ){
          var str = Math.floor( ( mod * 100 ) * ( floorBefore ? Math.floor( basePow + ( baseRate * 10 ) * ( growthType[type][i] * 100 ) * ( 100 - r ) / 100000 ) : ( basePow + ( baseRate * 10 ) * ( growthType[type][i] * 100 ) * ( 100 - r ) / 100000 ) ) / 100 );
          if( mod != 1 ) str += '(' + Math.floor( basePow + ( baseRate * 10 ) * ( growthType[type][i] * 100 ) * ( 100 - r ) / 100000 ) + ')';
          var td = $(row.find("td")[i + 2]);
          td.text(str);
          if( i + 1 == level ){ td.addClass("success"); }
        }
        tbody.append(row);
        noTR = false;
      }

    }
    if( noTR ){
      var row = $("#table-template").find("#nomatch").clone();
      tbody.append(row);
    }
    o.append(thead);
    o.append(tbody);

    if( noTR && round){
      calc(true);
    }

//    o.appendChild( document.createElement( 'br' ) );
//    o.appendChild( document.createTextNode( 'この検索条件へのリンク(試験的な機能です。そのうち消去するかも)' ) );
//    o.appendChild( document.createElement( 'br' ) );
//    var link = document.createElement( 'a' );
//    link.href = location.protocol + '//' + location.host + location.pathname + makeQuery();
//    text = document.createTextNode( link.href );
//    link.appendChild( text );
//    o.appendChild( link );
  }catch( e ){
    alert( e.stack || e );
  }
}
