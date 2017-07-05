/*
 * DialogX
 * @author: Harcharan Singh <artisangang@gmail.com>
 * @version 1.2
 * @git: https://github.com/artisangang/dialogX
 */
(function(w) { 'use strict';

    Object.merge = function (){
        var mergedObject = {};

        for (var i in arguments) {
            if (typeof arguments[i] != 'object') {
                throw new Error('Invalid object reference.');
            }
            for (var attribute in arguments[i]) { mergedObject[attribute] = arguments[i][attribute]; }
        }
        return mergedObject;
    }

    var config = {
        width: 480,
        innerPadding: '15px',
        top: 3
    };

    var decorator = {
        draw: function (instance, content) {
            var container = document.createElement("div");
            container.className = "dialogX";
            container.style.background = "white";
            container.style.color = "black";
            container.style.border = "2px solid rgba(0,0,0,0.7)";
            container.style.maxWidth = config.width + "px";
            
            container.style.position = "fixed";
            container.style.zIndex = 999999;
            container.style.display = 'none';
            container.style.opacity = '0';

            container.appendChild(content);
          
            document.body.appendChild(container);
         
            container.style.display = 'block';

            instance.refresh();

            if (!document.getElementById("dialogX-disabled-screen")){
                var overlay = document.createElement('div');
                overlay.className = 'dialogX-disabled-screen';
                overlay.id = "dialogX-disabled-screen";

                document.body.appendChild(overlay);
            }

            var opacity = 0;
            var effect = setInterval(function () {                
                opacity += 0.1;

                if (opacity >= 1) {
                    clearInterval(effect);
                } else {                    
                    container.style.opacity = opacity;
                }
            }, 50);
           

            return container;

        },
        container: function () {
            var div = document.createElement("div");
            div.className = 'dialogX-container';
            div.style.padding = config.innerPadding;
            return div;
        },
        form: function (attributes) {

        }
    };

function dialogX() {
	
    var instance = this;

    this.decorator = decorator;
	

	document.addEventListener("DOMContentLoaded", function(event) { 
        
		window.addEventListener("resize", instance.refresh, false);
		instance.refresh();
	});
    
    //window.removeEventListener("resize", resize, false);

}

dialogX.prototype.enableScreen = function (force, container) {

    var elements = document.getElementsByClassName('dialogX');
        
    if (!elements.length || (force && force == true)) {

        var overlay = container || document.getElementById("dialogX-disabled-screen");

         document.getElementsByTagName('body')[0].removeChild(overlay);
         
         //overlay.outerHTML = '';
    }

}

dialogX.prototype.refresh = function () {
    var elements = document.getElementsByClassName('dialogX');
        
        if (elements.length) {
            for (var i in elements) {
            
                if (typeof elements[i].style != 'undefined') {
                    
                    elements[i].style.left = ((window.innerWidth - elements[i].offsetWidth) / 2) + "px";
                    elements[i].style.top = ((window.innerHeight - elements[i].offsetHeight) / config.top) + "px";
                }
            }
        }
}

dialogX.prototype.prompt = function () {

}

dialogX.prototype.alert = function (obj) {

    var instance = this;

    var defaultConfig = {
        buttonText: 'OK',
        title: false

    };

    if (typeof obj === 'string') {
        defaultConfig.message = obj;
    } else {
       defaultConfig = Object.merge(defaultConfig, obj);
    }

   

   var message = document.createElement('div');
   message.className = 'dialogX-alert';
  
   var p = document.createElement('p');
   p.className = 'dialogX-alert-content';
   p.innerHTML = defaultConfig.message;

   message.appendChild(p);

   var button = document.createElement('button');
   button.className = 'button button-1';
   button.innerHTML = defaultConfig.buttonText;

   message.appendChild(button);

   var container = decorator.container();
   container.appendChild(message);
   container = decorator.draw(this, container);

    button.addEventListener('click', function () {
        instance.enableScreen(true, container);
        instance.enableScreen();
   }, false);

}

dialogX.prototype.confirm = function (obj, callback) {

    var instance = this;

    var defaultConfig = {
        message: '',
        buttons: 2,
        buttonText: ['Yes', 'No'],
        title: false
    };

    defaultConfig = Object.merge(defaultConfig, obj);    

   

   var message = document.createElement('div');
   message.className = 'dialogX-confirm';
  
    if (defaultConfig.message.length) {
       var p = document.createElement('p');
       p.className = 'dialogX-confirm-content';
       p.innerHTML = defaultConfig.message;

        message.appendChild(p);
    }

    //var buttons = [];

    for (var i=0; i<defaultConfig.buttons; i++) {
       var button = document.createElement('button');
       button.innerHTML = defaultConfig.buttonText[i];

       var btnCls = '';

       if (defaultConfig.buttonClasses && defaultConfig.buttonClasses[i]) {
            btnCls = defaultConfig.buttonClasses[i];
       }

       if (i == 0) {
            button.className = 'button button-1 ' + btnCls;
        } else {
            button.className = 'button button-2 number-' + i + ' ' + btnCls;
        }
       button.setAttribute('data-identity', i);
       message.appendChild(button);

       button.addEventListener('click', function (e) {

            instance.enableScreen(true, container);            
            callback(parseInt(e.target.getAttribute('data-identity')));
            instance.enableScreen();
       }, false);

    }

   var container = decorator.container();
   container.appendChild(message);
   container = decorator.draw(this, container); 

}

dialogX.prototype.password = function(config, callback) {

    var instance = this;
 
    var defaultConfig = Object.merge({
        message: 'Enter password to procceed?',
        buttonText: 'Submit',
        title: false

    }, config);
   
    if (typeof callback !== "function") {
        var callback = function(password){}; 
    }   
 
   
    var container = decorator.container();

    var label = document.createElement("div");
    label.className = 'dialogX-prompt-content dialogX-prompt-password low-pad';
    label.innerHTML = defaultConfig.message;

    container.appendChild(label);

    var inputGroup = document.createElement("div");
    inputGroup.className = 'dx-inputs';

    var input = document.createElement("input");
    input.type = "password";

    input.addEventListener("keyup", function(e) {
        if (e.keyCode == 13) submit();
    }, false);
    inputGroup.appendChild(input);
    container.appendChild(inputGroup);

    container.appendChild(document.createElement("br"));

    var button = document.createElement("button");
    button.className = 'button button-1';
    button.innerHTML = defaultConfig.buttonText;

    container.appendChild(button);

    if (defaultConfig.cancelButtonText) {
        var cancelButton = document.createElement('button');
       cancelButton.className = 'button button-2 cancel-button';
       cancelButton.innerHTML = defaultConfig.cancelButtonText;
       cancelButton.addEventListener('click', function () {
            instance.enableScreen(true, container);
            instance.enableScreen();
        }, false);

       container.appendChild(cancelButton);
    }

  
    


    var container = decorator.draw(this, container);    
    
    button.addEventListener("click", function() {

        if (!input.value.length) {
            input.className = 'malformed';
            return;
        }
        input.className = 'valid';

        callback({
            value: input.value, 
            close: function () {            
                instance.enableScreen(true, container);
                instance.enableScreen();
            }, 
            malformed: function () { 
                input.className = 'malformed'; 
            }, 
            valid: function () { 
                input.className = 'malformed'; 
            }
        });

    }, false);

}

dialogX.prototype.config = function (customConfig) {
    config = Object.merge(config, customConfig);
};


w.dialogX = new dialogX();

})(window);
