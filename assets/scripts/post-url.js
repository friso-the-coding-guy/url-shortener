'url-strict';

const URLINDEX = 0;
const SHORTURIINDEX = 1;

const getInputValue = (event, index) => {
    return event.target[index].value;
}

$('document').ready(() => {
    console.log('document is ready')
    $('#url-form').on('submit', ( event ) => {
        event.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/url",
            'dataType': 'json',
            'processData': false,
            'contentType': 'application/json',
            data: JSON.stringify({
                url: getInputValue(event, URLINDEX),
                shortUri: getInputValue(event, SHORTURIINDEX)
            }),
            success: ( result ) => {
                console.log(result);

                const id = result.id[0]._id;
                const url = result.id[0].url;
                const shortUri = result.id[0].shortUri;

                const html = `<strong>Short Uri:</strong> ${shortUri}<br>
                              <strong>Id:</strong> ${id}`;

                
                $( "#url-response" ).html( html );
            }
          });
    });
});
