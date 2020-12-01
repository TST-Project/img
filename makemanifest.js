const fs = require('fs');
const sizeOf = require('image-size');

fs.readdir('./',function(err,files) {
    if(err)
        return err;
    const flist = [];
    files.forEach(function(f) {
        if(/\.png$/.test(f))
            flist.push(f);
    });
    readfiles(flist);
});

const readfiles = function(arr) {
    const imgs = arr.map((f) => 
    {
        //const img = fs.readFileSync(f,{encoding:'utf-8'});
        const size = sizeOf(f);
        return {name:f,width:size.width,height:size.height};
    });
    imgs.sort((a,b) => {
        if(parseInt(a.name) < parseInt(b.name)) return -1;
        else return 1;
    });
    const canvases = imgs.map((img,i) => 
    {
        const ret = {
            '@id': `https://tst-project.gitnub.io/Sanskrit/img/Sanscrit_1146/index.json/canvas/${i+1}`,
            'type': 'Canvas',
            'height': img.height,
            'width': img.width,
            'label': img.name.replace(/\.[^/.]+$/,''),
            'items': [
                {
                    '@id': `https://tst-project.github.io/Sanskrit/img/Sanscrit_1146/index.json/canvas/${i+1}/annotationpage/1`,
                    'type': 'AnnotationPage',
                    'items': [
                        {
                            '@id': `https://tst-project.github.io/Sanskrit/img/Sanscrit_1146/index.json/canvas/${i+1}/annotation/1`,
                            'type': 'Annotation',
                            'motivation': 'painting',
                            'body': {
                                '@id': `https://tst-project.github.io/Sanskrit/img/Sanscrit_1146/${img.name}`,
                                'type': 'Image',
                                'format': 'image/png',
                                'height': img.height,
                                'width': img.width
                            },
                            'target': `https://tst-project.github.io/Sanskrit/img/Sanscrit_1146/index.json/canvas/${i+1}`
                        }
                    ]
                }
            ]
        };
        return ret;
    });
    const manifest =
    {
        '@context': [
            'http://www.w3.org/ns/anno.jsonld',
            'http://iiif.io/api/presentation//context.json'
        ],
        '@id': 'https://tst-project.github.io/Sanskrit/img/Sanscrit_1146/index.json',
        'type': 'Manifest',
        'label': 'BnF. Département des Manuscrits.',
        'attribution': 'Bibliothèque nationale de France',
        'description': '',
        'license': 'https://gallica.bnf.fr/html/und/conditions-dutilisation-des-contenus-de-gallica',
        'metadata': [
            { 
                'label': 'Shelfmark',
                'value': 'Bibliothèque nationale de France. Département des Manuscrits. Sanscrit 1145'
            },
            {
                'label': 'Title',
                'value': ''
            },
            {
                'label': 'Date',
                'value': ''
            },
            {
                'label': 'Language',
                'value': 'Sanskrit'
            }
        ],
        'sequences': [
            {
                'canvases': canvases,
            }
        ]
    };
    fs.writeFile('index.json',JSON.stringify(manifest,null,4),{encoding: 'utf8'},function(){return;});
};
