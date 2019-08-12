<pre>
_  ______   ____________  ____ 
|_/ |__/ \_/ |__]| |__||\ ||  \
| \_|  \  |  |   | |  || \||__/
</pre>
What problem does Delayed Http Operations solve?
This package can be used to delay all your HTTP Requests up to a certain point without the hassle of locally providing multiple states.

To use it add the DelayedHttpOperationsService to the providers array in the scope of your liking. 
(It is recommended to add it to AppModule though)

<pre>
[...]
import { DelayedHttpOperationsService } from 'projects/delayed-http-operations/src/lib/services/delayed-http-operations.service';

@NgModule({
 [...]
  providers: [DelayedHttpOperationsService],
  [...]
})
export class AppModule {}
</pre>

For an example look into https://github.com/Kryptand/delayed-http-operations


