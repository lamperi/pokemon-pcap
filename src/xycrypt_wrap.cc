#include <node.h>
#include <node_buffer.h>
#include <v8.h>
#include <cstring>

#include "xycrypt.h"

using namespace v8;

Handle<Value> Decrypt(const Arguments& args) {
	HandleScope scope;
	char* content = node::Buffer::Data(args[0]->ToObject());
	int contentlength = node::Buffer::Length(args[0]->ToObject());

	char outcontent[contentlength];

	int outcontentlength = xy_decrypt(content, contentlength, outcontent);

	node::Buffer *slowBuffer = node::Buffer::New(outcontentlength);
	memcpy(node::Buffer::Data(slowBuffer), outcontent, outcontentlength);

	Local<Object> globalContext = Context::GetCurrent()->Global();
	Local<Function> nodeBufferConstructor = Local<Function>::Cast(globalContext->Get(String::New("Buffer")));
	Handle<Value> constructorArgs[3] = { slowBuffer->handle_, Integer::New(outcontentlength), Integer::New(0) };
	Local<Object> nodeBuffer = nodeBufferConstructor->NewInstance(3, constructorArgs);
	return scope.Close(nodeBuffer);
}

void init(Handle<Object> exports) {
	exports->Set(String::NewSymbol("decrypt"),
		FunctionTemplate::New(Decrypt)->GetFunction());
}

NODE_MODULE(xycrypt, init)

