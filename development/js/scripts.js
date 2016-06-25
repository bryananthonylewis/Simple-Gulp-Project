/*
this is a multi line comment... testing
 */
function test() {
    console.log('test is running');
    console.log('change has been made')
} // end function test


$(document).ready(function() {
    $(document).foundation(); // Foundation Function
    console.log('dom loaded'); //testing
    test();
    $('.row').fadeIn("fast");
}); // END Doc.Ready
