//
//  Search.m
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/21/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import "Search.h"

@implementation Search

-(instancetype)initWithDictionary:(NSDictionary *)searchParams
{
    NSLog(@"innnnnnnnnnnnnn");
    self = [super init];
    if(self)
    {
        int count = 0;
        self.postString = [[NSString alloc]init];
        if([searchParams objectForKey:@"subject"]!=nil)
        {
            _postString = [NSString stringWithFormat:@"subject=%@",[searchParams objectForKey:@"subject"]];
            self.subjectSet = YES;
            count ++;
            
        }
        if([searchParams objectForKey:@"cname"]!=nil)
        {
            if(count >0)
            {
                _postString = [NSString stringWithFormat:@"%@&cname=%@",_postString,[searchParams objectForKey:@"cname"]];

            }else{
                _postString = [NSString stringWithFormat:@"cname=%@",[searchParams objectForKey:@"cname"]];
            }
            self.courseNameSet = YES;
            count ++;
        }
        if([searchParams objectForKey:@"cnumber"]!=nil)
        {
            if(count >0)
            {
                _postString = [NSString stringWithFormat:@"%@&cnumber=%@",_postString,[searchParams objectForKey:@"cnumber"]];
                
            }else{
                _postString = [NSString stringWithFormat:@"cnumber=%@",[searchParams objectForKey:@"cnumber"]];
            }

            count++;
            self.courseNumberSet = YES;
            
        }
        if([searchParams objectForKey:@"available"]!=nil)
        {
            if(count >0)
            {
                _postString = [NSString stringWithFormat:@"%@&available=%@",_postString,[searchParams objectForKey:@"available"]];
                
            }else{
                _postString = [NSString stringWithFormat:@"available=%@",[searchParams objectForKey:@"available"]];
            }

            self.availableSet = YES;
            
        }

    }
    return self;
}
@end
