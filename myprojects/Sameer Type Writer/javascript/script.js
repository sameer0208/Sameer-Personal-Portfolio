// Typing Animation 
var typed = new Typed(".introtext",{
    strings:["Welcome To Sameer Type Writer","Type easily with designed keyboard","Enjoy Comfort And Type"],
    typeSpeed:50,
    backSpeed:50,
    loop:true
});

//Text Editor Menu
//Font Style
var font = document.getElementById("font");
font.addEventListener('click', fontstylehide);
 function fontstylehide(){
    if(document.getElementById("fontstyle").style.display=="none")
    {
        document.getElementById("fontstyle").style.display="block";
    }
    else{
    document.getElementById("fontstyle").style.display="none";
    }
}
//Font Size
var fonts = document.getElementById("fonts");
fonts.addEventListener('click', fontsizehide);
 function fontsizehide(){
    if(document.getElementById("fontsize").style.display=="none")
    {
        document.getElementById("fontsize").style.display="block";
    }
    else{
    document.getElementById("fontsize").style.display="none";
    }
}
//Bakground Color
var bckcolor = document.getElementById("bckcolor");
bckcolor.addEventListener('click', bgcolorhide);
 function bgcolorhide(){
    if(document.getElementById("bgcolor").style.display=="none")
    {
        document.getElementById("bgcolor").style.display="block";
    }
    else{
    document.getElementById("bgcolor").style.display="none";
    }
}
// Text Color
var textcolor = document.getElementById("textcolor");
textcolor.addEventListener('click', txtcolorhide);
 function txtcolorhide(){
    if(document.getElementById("txtcolor").style.display=="none")
    {
        document.getElementById("txtcolor").style.display="block";
    }
    else{
    document.getElementById("txtcolor").style.display="none";
    }
}
// Mode Changing
var txtbox = document.getElementsByClassName("texteditor")
var icon = document.getElementById("icon");
icon.onclick = function(){
    document.getElementById("texteditor").style.color="black";
    document.getElementById("txtarea").style.backgroundColor="rgba(192, 182, 150, 0.765)";
    icon.classList.toggle('fa-sun');
    if(icon.classList.contains('fa-sun'))
    {
    document.getElementById("texteditor").style.color="white";
    document.getElementById("txtarea").style.backgroundColor="black";
    }
}
//Adding audio to all the keys
const keypressaudio = document.getElementById("newaudio");
//Character Keypad
var a = document.getElementById("a");
var b = document.getElementById("b");
var c = document.getElementById("c");
var d = document.getElementById("d");
var e = document.getElementById("e");
var f = document.getElementById("f");
var g = document.getElementById("g");
var h = document.getElementById("h");
var i = document.getElementById("i");
var j = document.getElementById("j");
var k = document.getElementById("k");
var l = document.getElementById("l");
var m = document.getElementById("m");
var n = document.getElementById("n");
var o = document.getElementById("o");
var p = document.getElementById("p");
var q = document.getElementById("q");
var r = document.getElementById("r");
var s = document.getElementById("s");
var t = document.getElementById("t");
var u = document.getElementById("u");
var v = document.getElementById("v");
var w = document.getElementById("w");
var x = document.getElementById("x");
var y = document.getElementById("y");
var z = document.getElementById("z");
a.onclick = clickaction;
b.onclick = clickaction;
c.onclick = clickaction;
d.onclick = clickaction;
e.onclick = clickaction;
f.onclick = clickaction;
g.onclick = clickaction;
h.onclick = clickaction;
i.onclick = clickaction;
j.onclick = clickaction;
k.onclick = clickaction;
l.onclick = clickaction;
m.onclick = clickaction;
n.onclick = clickaction;
o.onclick = clickaction;
p.onclick = clickaction;
q.onclick = clickaction;
r.onclick = clickaction;
s.onclick = clickaction;
t.onclick = clickaction;
u.onclick = clickaction;
v.onclick = clickaction;
w.onclick = clickaction;
x.onclick = clickaction;
y.onclick = clickaction;
z.onclick = clickaction;
//Special Keys 
var enter = document.getElementById("enter");
var capslock = document.getElementById("capslock");
var backspace = document.getElementById("backspace");
var deleteall = document.getElementById("deleteall");
var selectall = document.getElementById("selectall");
enter.onclick = clickaction;
capslock.onclick = clickaction;
backspace.onclick = clickaction;
deleteall.onclick = clickaction;
selectall.onclick = clickaction;
var isCapslock = 0;
capslock.onclick = txtcapslock;
function txtcapslock(){
    if(isCapslock==0)
    {
        isCapslock=1;
        keypressaudio.play();
        document.getElementById("capslock").style.backgroundColor="white";
        document.getElementById("capslock").style.color="black";
    }
    else
    {
        isCapslock=0;
        keypressaudio.play();
        document.getElementById("capslock").style.backgroundColor="transparent";
        document.getElementById("capslock").style.color="white";
    }
}

//Numpad Keys
var seven = document.getElementById("7");
seven.onclick = clickaction;
var eight = document.getElementById("8");
eight.onclick = clickaction;
var nine = document.getElementById("9");
nine.onclick = clickaction;
var four = document.getElementById("4");
four.onclick = clickaction;
var five = document.getElementById("5");
five.onclick = clickaction;
var six = document.getElementById("6");
six.onclick = clickaction;
var one = document.getElementById("1");
one.onclick = clickaction;
var two = document.getElementById("2");
two.onclick = clickaction;
var three = document.getElementById("3");
three.onclick = clickaction;
var zero = document.getElementById("0");
zero.onclick = clickaction;
function clickaction(){
    keypressaudio.play();
}
a.onclick = txtdisa;
function txtdisa(){
    if(isCapslock==1){
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"A";
    keypressaudio.play();}
    else{
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"a";
    keypressaudio.play();
    }
}
b.onclick = txtdisb;
function txtdisb(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"B";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"b";
    keypressaudio.play();}
}
c.onclick = txtdisc;
function txtdisc(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"C";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"c";
    keypressaudio.play();}
}
d.onclick = txtdisd;
function txtdisd(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"D";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"d";
    keypressaudio.play();}
}
e.onclick = txtdise;
function txtdise(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"E";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"e";
    keypressaudio.play();}
}
f.onclick = txtdisf;
function txtdisf(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"F";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"f";
    keypressaudio.play();}
}
g.onclick = txtdisg;
function txtdisg(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"G";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"g";
    keypressaudio.play();}
}
h.onclick = txtdish;
function txtdish(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"H";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"h";
    keypressaudio.play();}
}
i.onclick = txtdisi;
function txtdisi(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"I";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"i";
    keypressaudio.play();}
}
j.onclick = txtdisj;
function txtdisj(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"J";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"j";
    keypressaudio.play();}
}
k.onclick = txtdisk;
function txtdisk(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"K";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"k";
    keypressaudio.play();}
}
l.onclick = txtdisl;
function txtdisl(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"L";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"l";
    keypressaudio.play();}
}
m.onclick = txtdism;
function txtdism(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"M";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"m";
    keypressaudio.play();}
}
n.onclick = txtdisn;
function txtdisn(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"N";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"n";
    keypressaudio.play();}
}
o.onclick = txtdiso;
function txtdiso(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"O";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"o";
    keypressaudio.play();}
}
p.onclick = txtdisp;
function txtdisp(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"P";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"p";
    keypressaudio.play();}
}
q.onclick = txtdisq;
function txtdisq(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"Q";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"q";
    keypressaudio.play();}
}
r.onclick = txtdisr;
function txtdisr(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"R";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"r";
    keypressaudio.play();}
}
s.onclick = txtdiss;
function txtdiss(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"S";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"s";
    keypressaudio.play();}
}
t.onclick = txtdist;
function txtdist(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"T";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"t";
    keypressaudio.play();}
}
u.onclick = txtdisu;
function txtdisu(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"U";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"u";
    keypressaudio.play();}
}
v.onclick = txtdisv;
function txtdisv(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"V";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"v";
    keypressaudio.play();}
}
w.onclick = txtdisw;
function txtdisw(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"W";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"w";
    keypressaudio.play();}
}
x.onclick = txtdisx;
function txtdisx(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"X";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"x";
    keypressaudio.play();}
}
y.onclick = txtdisy;
function txtdisy(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"Y";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"y";
    keypressaudio.play();}
}
z.onclick = txtdisz;
function txtdisz(){
    if(isCapslock==1){
        document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"Z";
        keypressaudio.play();}
        else{
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"z";
    keypressaudio.play();}
}

//Special Keys
enter.onclick = txtenter;
function txtenter(){
    document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+"\n";
    keypressaudio.play();
}
backspace.onclick = txtbackspace;
function txtbackspace(){
    document.getElementById("txtarea").innerHTML.length=document.getElementById("txtarea").innerHTML.length-1;
    
}
deleteall.onclick = txtalldelete;
function txtalldelete(){
    keypressaudio.play();
    if(confirm("Are you sure to delete all text?")==true){
    document.getElementById("txtarea").innerHTML="";}    
}
// spacebar.onclick = txtspacebar;
// function txtspacebar(){
//     keypressaudio.play();
//     document.getElementById("txtarea").innerHTML=document.getElementById("txtarea").innerHTML+" ";
// }
// if(window.KeyboardEvent)
// {
    // keypressaudio.play();
// }
// function enterkeypress(){
    // document.getElementById("enter").style.backgroundColor="white";
    // document.getElementById("enter").style.color="black";
// }
// document.addEventListener("keyup", function(event) {
    // if (event.keyCode === 13) {
        // myvar = setTimeout(enterkeypress,100);
        // clearTimeout(myvar);
    // // }
// });
