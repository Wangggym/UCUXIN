/**
 * Created by QiHan Wang on 2017/5/27.
 */
// Serialize an array of form elements or a set of
// key/values into a query string
const buildParams = function (prefix, obj, traditional, add) {
  var name;

  if (Array.isArray(obj)) {

    // Serialize array item.
    for (let i in obj) {
      if (traditional || /\[\]$/.test(prefix)) {

        // Treat each array item as a scalar.
        add(prefix, obj[i]);

      } else {

        // Item is non-scalar (array or object), encode its numeric index.
        buildParams(
          prefix + "[" + ( typeof obj[i] === "object" && obj[i] != null ? i : "" ) + "]",
          obj[i],
          traditional,
          add
        );
      }
    }

  } else if (!traditional && Object.prototype.toString.call(obj) === "[object Object]") {

    // Serialize object item.
    for (name in obj) {
      buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
    }

  } else {

    // Serialize scalar item.
    add(prefix, obj);
  }
}

// paramString
export function queryString(a, traditional) {
  var prefix,
    s = [],
    add = function (key, valueOrFunction) {

      // If value is a function, invoke it and use its return value
      var value = Object.prototype.toString.call(valueOrFunction) === '[object Function]' ?
        valueOrFunction() :
        valueOrFunction;

      s[s.length] = encodeURIComponent(key) + "=" +
        encodeURIComponent(value == null ? "" : value);
    };

  // If an array was passed in, assume that it is an array of form elements.
  //if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
  if (Array.isArray(a)) {
    // Serialize the form elements
    for (let i in a) {
      add(i, a[i]);
    }

  } else {

    // If traditional, encode the "old" way (the way 1.3.2 or older
    // did it), otherwise encode params recursively.
    for (prefix in a) {
      buildParams(prefix, a[prefix], traditional, add);
    }
  }

  // Return the resulting serialization
  return s.join("&");
};
