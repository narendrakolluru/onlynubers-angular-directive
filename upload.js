app.directive('ngFiles', ['$parse', function($parse) {
  function fn_link(scope, element, attrs) {
    var onChange = $parse(attrs.ngFiles);
    element.on('change', function(event) {
      onChange(scope, {
        $files: event.target.files
      });
    });
  };
  return {
    link: fn_link
  }
}]);

app.directive('loading', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="loading"><img src="http://www.nasa.gov/multimedia/videogallery/ajax-loader.gif" width="20" height="20" />LOADING...</div>',
    link: function(scope, element, attr) {
      scope.$watch('loading', function(val) {
        if (val)
          $(element).show();
        else
          $(element).hide();
      });
    }
  }
})

app.directive('validFile', function() {
  return {
    require: 'ngModel',
    link: function(scope, el, attrs, ctrl) {
      ctrl.$setValidity('validFile', el.val() != '');
      //change event is fired when file is selected
      el.bind('change', function() {
        ctrl.$setValidity('validFile', el.val() != '');
        scope.$apply(function() {
          ctrl.$setViewValue(el.val());
          ctrl.$render();
        });
      });
    }
  }
})

//Only nuber directive
app.directive("onlyNumber", function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {
            element.bind('input', function () {
                var position = this.selectionStart - 1;

                //remove all but number
                //var fixed = this.value.replace(/[^0-9]/g, ''); //Decimal value not allowed
                var fixed = this.value.replace(/[^0-9\.]/g, ''); // allowed Decimal value
                if (fixed.charAt(0) === '.')                  //can't start with .
                    fixed = fixed.slice(1);

                var pos = fixed.indexOf(".") + 1;
                if (pos >= 0)               //avoid more than one .
                    fixed = fixed.substr(0, pos) + fixed.slice(pos).replace('.', '');

                if (this.value !== fixed) {
                    this.value = fixed;
                    this.selectionStart = position;
                    this.selectionEnd = position;
                }
            });
        }
    };
});


app.directive('confirmationNeeded', function() {
  return {
    priority: 1,
    terminal: true,
    link: function(scope, element, attr) {
      var msg = attr.confirmationNeeded || "Are you sure?";
      var clickAction = attr.ngClick;
      element.bind('click', function() {
        if (window.confirm(msg)) {
          scope.$eval(clickAction)
        }
      });
    }
  };
});
