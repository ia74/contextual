import ctxl from '../contextual.js'; // Import CTXL

// We need to add our view to the list
ctxl.addView('coolView') // It's in views/coolView.html!
ctxl.addView('otherCoolView') // It's in views/otherCoolView.html!

// Now, if we want to destroy every view in the container before adding "coolView"
ctxl.destructiveView('coolView') // This destroys the innerHTML of the container and adds the view.

// And since we want to add the other cool view on top,
ctxl.nonDestructiveView('otherCoolView') // This just appends the view to the container.

// If we want to reload a view, we can do this:
ctxl.reloadView('coolView') // This will reload the view *in place*, and reload all scripts that were added to the document.

setTimeout(() => {
  // In 2.5 seconds, we'll put the otherCoolView on top, and remove the coolView.
  ctxl.destructiveView('otherCoolView');
  setTimeout(() => {
    // then after 1 second, we'll put the coolView but this time non-destructively.
    ctxl.nonDestructiveView('coolView');
    setTimeout(async () => {
      // Actually.. let's close otherCoolView, but alert when it's closed.
      ctxl.waitForClose('otherCoolView').then(() => {
        alert('otherCoolView closed!');
      })
      ctxl.closeView('otherCoolView');
    }, 1000);
  }, 1000);
},2500);