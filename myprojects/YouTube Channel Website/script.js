document.getElementById('galleryicon').addEventListener('click',dispgal);
function dispgal()
{
    if(document.getElementById('gd').style.display=="none")
       {
        document.getElementById('gd').style.display="block";
       }
       else
       {
        document.getElementById('gd').style.display="none";
       }
}
function ytbtn()
{
    alert("You are launching to YouTube Channel");
}
launchbtn.onClick = ytbtn;
function launchfcw()
{
    alert("You are launching to Flipkart Clone Website");
}
ltfcw.onClick=launchfcw;

let username = document.getElementById("username");

let namein = prompt("Please Enter your name here: ");
if(namein.length!=0)
{
document.getElementById("username").innerHTML="Hi "+namein;
}
