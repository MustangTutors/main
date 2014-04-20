//
//  Meeting.h
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/16/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Meeting : NSObject
@property(nonatomic,strong)NSDate * date;
@property(nonatomic,strong)NSDate * startTime;
@property(nonatomic,strong)NSDate * endTime;
@property(nonatomic,getter = getSmuId)NSInteger smuId;
@property(nonatomic,strong)NSString * courseName;
@property(nonatomic,strong)NSString * comment;
@end
