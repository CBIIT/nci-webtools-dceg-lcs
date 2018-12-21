/**

    Make sure the object has the following structure.

    var yourGlossaryObject = {
        termObject: {
            fullName: "A Term"
            definition: "The definition"
        }, ...
    }

    Then, to load glossary terms for your
    application, extend the global glossary object:

    $.extend($_Glossary, yourGlossaryObject);

    Finally, bind the event handler, to the elements you want to be tooltips.

    $(document).on("click", ".classForTooltips", termDisplay);

    -OR- For custom styled tooltips pass an object to the event handler.

    var customOptions = {
        template: templateString,
        titleClass: titleClassName,
        contentClass: contentClassName,
        tooltipPosition: tooltipPositionObject,
        tooltipContainerClass: containerClassName,
    };

    $(document).on("click touchstart", ".classForTooltips", customOptions, termDisplay);

**/
var default_template = "<div class='default-tooltip'><div class='arrow'></div><div class='default-tooltip-title'></div><div class='default-tooltip-content'></div></div>";

var $_Glossary = {};

// use custom template by passing a
// html string of the custom tooltip element
function termDisplay(e) {
    var $self = $(this);

    var dTerm = $self.attr('data-term');

    if (typeof $_Glossary[dTerm] === "undefined") return;
    var definition = $_Glossary[dTerm].definition;
    var term = $_Glossary[dTerm].fullName;

    if (definition || term) {
        var popoverTemplate = $(default_template);

        if (!term || term.length === 0) {
            popoverTemplate.find(".default-tooltip-title").remove();
        }

        var options = {
            position: {
                my: "left top+20",
                at: "center",
                of: $(this),
            },
            tooltipClass: "default-tooltip",
            items: "[data-term]", // can use multiple elements
            placement: 'top',
            title: term
        };

        popoverTemplate.find(".default-tooltip-title").text(term);
        popoverTemplate.find(".default-tooltip-content").text(definition);
		
        if (e.data) {
            if (e.data.titleClass)
                popoverTemplate.find("." + e.data.titleClass).text(term);
            else
                popoverTemplate.find(".default-tooltip-title").text(term);

            if (e.data.contentClass)
                popoverTemplate.find("." + e.data.contentClass).text(definition);
            else
                popoverTemplate.find(".default-tooltip-content").text(definition);

            if (e.data.tooltipPosition)
                options.position = e.data.tooltipPosition;

            if (e.data.template)
                popoverTemplate = $(e.data.template);

            if (e.data.tooltipContainerClass)
                options.tooltipClass = e.data.tooltipContainerClass;
        }

        options['content'] = function () {
            return popoverTemplate;
        }

		if ($self.popover) {
            $(options.items).not(this).popover('hide');

			$self.popover({
				selector: options.items,
				placement: options.placement,
				template: popoverTemplate,
				title: options.title,
				container: 'body'
			}).on('mouseleave', function () {
				$self.popover('hide');
			});

			$self.popover('show');
		}
		else {
            $(options.items).not(this).tooltip('close');
            
			$self.tooltip(options).on('mouseleave', function () {
				$self.tooltip('destroy');
			});
			$self.tooltip(options).tooltip('open');
		}
    }
}

$(function () {
    $(document).on('touchend', function () {
        $("." + options.tooltipClass).tooltip('destroy');
    });
});
